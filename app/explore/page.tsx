'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Search, 
  CalendarDays, 
  MapPin, 
  PenTool, 
  Wifi, 
  Utensils as KitchenIcon, 
  Wind, 
  Waves, 
  Car, 
  Tv, 
  Coffee, 
  Dog, 
  Star, 
  Grid, 
  Map,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import ListingCard from '@/components/ListingCard';
import { Listing } from '@/app/types';

// Extended amenities list
const ALL_AMENITIES = [
  { id: 'wifi', name: 'WiFi', icon: Wifi },
  { id: 'kitchen', name: 'Kitchen', icon: KitchenIcon },
  { id: 'ac', name: 'Air Conditioning', icon: Wind },
  { id: 'beach', name: 'Beach Access', icon: Waves },
  { id: 'parking', name: 'Parking', icon: Car },
  { id: 'tv', name: 'TV', icon: Tv },
  { id: 'coffee', name: 'Coffee Maker', icon: Coffee },
  { id: 'pets', name: 'Pet Friendly', icon: Dog },
];

export default function ExplorePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State for listings and loading
  const [listings, setListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State for filters
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [priceRange, setPriceRange] = useState([0, 5]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  
  // Fetch listings from the backend
  useEffect(() => {
    async function fetchListings() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/listings');
        if (!response.ok) throw new Error('Failed to fetch listings');
        
        const data = await response.json();
        setListings(data);
        setFilteredListings(data);
      } catch (error) {
        console.error('Error fetching listings:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchListings();
  }, []);
  
  // Apply initial filters from URL if present
  useEffect(() => {
    const location = searchParams.get('location');
    if (location) setSearchQuery(location);
    
    const fromDate = searchParams.get('fromDate');
    const toDate = searchParams.get('toDate');
    
    if (fromDate && toDate) {
      setDateRange({
        from: new Date(fromDate),
        to: new Date(toDate)
      });
    }
    
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    if (minPrice && maxPrice) {
      setPriceRange([parseInt(minPrice), parseInt(maxPrice)]);
    }
    
    const amenities = searchParams.get('amenities');
    if (amenities) {
      setSelectedAmenities(amenities.split(','));
    }
    
    const rating = searchParams.get('rating');
    if (rating) {
      setMinRating(parseInt(rating));
    }
  }, [searchParams]);
  
  // Filter listings based on all criteria
  useEffect(() => {
    if (listings.length === 0) return;
    
    const filtered = listings.filter(listing => {
      // Search query filter (location or title)
      const matchesSearch = 
        !searchQuery ||
        listing.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.title.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Price range filter
      const matchesPrice = 
        listing.price >= priceRange[0] && listing.price <= priceRange[1];
      
      // Amenities filter
      const matchesAmenities = 
        selectedAmenities.length === 0 || 
        selectedAmenities.every(amenityId => {
          const amenityName = ALL_AMENITIES.find(a => a.id === amenityId)?.name || '';
          return listing.amenities.includes(amenityName);
        });
      
      // Date range filter
      let matchesDates = true;
      if (dateRange.from && dateRange.to && listing.availability) {
        // Check if any availability period overlaps with the requested dates
        matchesDates = listing.availability.some(period => {
          const availableFrom = new Date(period.startDate);
          const availableTo = new Date(period.endDate);
          return availableFrom <= dateRange.from! && availableTo >= dateRange.to!;
        });
      }
      
      // Rating filter (calculate rating based on host tokens)
      const listingRating = Math.min(5, Math.max(3, listing.host.tokens / 10));
      const matchesRating = listingRating >= minRating;
      
      return matchesSearch && matchesPrice && matchesAmenities && matchesDates && matchesRating;
    });
    
    setFilteredListings(filtered);
  }, [listings, searchQuery, dateRange, priceRange, selectedAmenities, minRating]);
  
  // Update URL with filters
  const updateFiltersInURL = () => {
    const params = new URLSearchParams();
    
    if (searchQuery) {
      params.append('location', searchQuery);
    }
    
    if (dateRange.from) {
      params.append('fromDate', dateRange.from.toISOString());
    }
    if (dateRange.to) {
      params.append('toDate', dateRange.to.toISOString());
    }
    
    params.append('minPrice', priceRange[0].toString());
    params.append('maxPrice', priceRange[1].toString());
    
    if (selectedAmenities.length > 0) {
      params.append('amenities', selectedAmenities.join(','));
    }
    
    if (minRating > 0) {
      params.append('rating', minRating.toString());
    }
    
    // Replace the current URL without refreshing the page
    const url = `/explore?${params.toString()}`;
    router.push(url, { scroll: false });
  };
  
  // Debounced filter update
  useEffect(() => {
    const timer = setTimeout(() => {
      updateFiltersInURL();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchQuery, dateRange, priceRange, selectedAmenities, minRating]);
  
  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setDateRange({ from: undefined, to: undefined });
    setPriceRange([0, 5]);
    setSelectedAmenities([]);
    setMinRating(0);
    router.push('/explore', { scroll: false });
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Explore Homes</h1>
        
        {/* Search and Filters Bar */}
        <div className="bg-card rounded-lg shadow-sm p-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Location Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by location or title..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Date Range */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full justify-start text-left ${
                    !dateRange.from && 'text-muted-foreground'
                  }`}
                >
                  <CalendarDays className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    "Select dates"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            
            {/* Price Range */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Price (tokens)</span>
                <span className="text-sm font-medium">{priceRange[0]} - {priceRange[1]}</span>
              </div>
              <Slider
                defaultValue={[0, 5]}
                max={5}
                step={1}
                value={priceRange}
                onValueChange={setPriceRange}
              />
            </div>
            
            {/* View Toggle */}
            <div className="flex justify-end">
              <Tabs defaultValue="grid" className="w-full" onValueChange={(v) => setViewMode(v as 'grid' | 'map')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="grid">
                    <Grid className="h-4 w-4 mr-2" />
                    Grid
                  </TabsTrigger>
                  <TabsTrigger value="map">
                    <Map className="h-4 w-4 mr-2" />
                    Map
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
          
          {/* Additional Filters */}
          <div className="mt-4 flex flex-wrap gap-4">
            {/* Amenities Filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  Amenities ({selectedAmenities.length})
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="grid grid-cols-2 gap-4">
                  {ALL_AMENITIES.map((amenity) => {
                    const IconComponent = amenity.icon;
                    return (
                      <div key={amenity.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`amenity-${amenity.id}`}
                          checked={selectedAmenities.includes(amenity.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedAmenities([...selectedAmenities, amenity.id]);
                            } else {
                              setSelectedAmenities(selectedAmenities.filter(id => id !== amenity.id));
                            }
                          }}
                        />
                        <label 
                          htmlFor={`amenity-${amenity.id}`}
                          className="flex items-center text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          <IconComponent className="h-4 w-4 mr-1 text-primary" />
                          {amenity.name}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </PopoverContent>
            </Popover>
            
            {/* Rating Filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  Rating ({minRating}+)
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <h4 className="font-medium">Minimum Rating</h4>
                  <div className="flex space-x-2">
                    {[0, 1, 2, 3, 4, 5].map((rating) => (
                      <Button
                        key={rating}
                        variant={minRating === rating ? "default" : "outline"}
                        size="sm"
                        onClick={() => setMinRating(rating)}
                        className="w-10 h-10 p-0"
                      >
                        {rating > 0 ? rating : 'Any'}
                      </Button>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            
            {/* Clear Filters */}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={clearFilters}
            >
              Clear Filters
            </Button>
          </div>
        </div>
        
        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading listings...</span>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-6">
              <p className="text-muted-foreground">
                {filteredListings.length} {filteredListings.length === 1 ? 'home' : 'homes'} found
              </p>
            </div>
            
            {/* View Modes */}
            {viewMode === 'grid' ? (
              /* Grid View */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredListings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            ) : (
              /* Map View */
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left sidebar with scrollable listings */}
                <div className="md:col-span-1 h-[calc(100vh-200px)] overflow-y-auto pr-4 space-y-4">
                  {filteredListings.map((listing) => (
                    <Card key={listing.id} className="overflow-hidden">
                      <div className="flex p-4">
                        <div className="w-24 h-24 rounded-md overflow-hidden flex-shrink-0 mr-4 relative">
                          <Image
                            src={listing.images[0]}
                            alt={listing.title}
                            fill
                            sizes="96px"
                            style={{ objectFit: 'cover' }}
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm line-clamp-1">{listing.title}</h3>
                          <div className="flex items-center text-xs text-muted-foreground mb-1">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span>{listing.location}</span>
                          </div>
                          <div className="flex items-center text-xs mb-1">
                            <Star className="h-3 w-3 text-yellow-500 mr-1" />
                            <span>{(Math.min(5, Math.max(3, listing.host.tokens / 10))).toFixed(1)}</span>
                          </div>
                          <div className="flex items-center text-xs font-medium text-primary">
                            <PenTool className="h-3 w-3 mr-1" />
                            <span>{listing.price} tokens/night</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
                
                {/* Map container */}
                <div className="md:col-span-2 bg-muted rounded-lg h-[calc(100vh-200px)] flex items-center justify-center">
                  <div className="text-center p-8">
                    <Map className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-medium mb-2">Map View</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      This is a placeholder for an interactive map. In a real application, 
                      this would display an actual map with markers for each listing.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* No Results */}
            {filteredListings.length === 0 && !isLoading && (
              <div className="text-center py-12 bg-muted rounded-lg">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">No homes found</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Try adjusting your search filters to find more options.
                </p>
                <Button 
                  className="mt-4" 
                  onClick={clearFilters}
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
