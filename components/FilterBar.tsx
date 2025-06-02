'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Search, 
  CalendarDays, 
  Wifi, 
  Utensils as KitchenIcon, 
  Wind, 
  Waves, 
  Car, 
  Tv, 
  Coffee, 
  Dog, 
  Star 
} from 'lucide-react';
import { format } from 'date-fns';

// Extended amenities list
const ALL_AMENITIES = [
  { id: 'WiFi', name: 'WiFi', icon: Wifi },
  { id: 'Kitchen', name: 'Kitchen', icon: KitchenIcon },
  { id: 'Air Conditioning', name: 'Air Conditioning', icon: Wind },
  { id: 'Beach Access', name: 'Beach Access', icon: Waves },
  { id: 'Parking', name: 'Parking', icon: Car },
  { id: 'TV', name: 'TV', icon: Tv },
  { id: 'Coffee Maker', name: 'Coffee Maker', icon: Coffee },
  { id: 'Pet Friendly', name: 'Pet Friendly', icon: Dog },
];

interface FilterBarProps {
  initialFilters: {
    location?: string;
    fromDate?: string;
    toDate?: string;
    minPrice?: string;
    maxPrice?: string;
    amenities?: string;
    rating?: string;
  };
}

export default function FilterBar({ initialFilters }: FilterBarProps) {
  const router = useRouter();
  
  // State for filters
  const [searchQuery, setSearchQuery] = useState(initialFilters.location || '');
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: initialFilters.fromDate ? new Date(initialFilters.fromDate) : undefined,
    to: initialFilters.toDate ? new Date(initialFilters.toDate) : undefined,
  });
  const [priceRange, setPriceRange] = useState([
    parseInt(initialFilters.minPrice || '0'), 
    parseInt(initialFilters.maxPrice || '5')
  ]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    initialFilters.amenities ? initialFilters.amenities.split(',') : []
  );
  const [minRating, setMinRating] = useState(parseInt(initialFilters.rating || '0'));

  // Apply filters
  const applyFilters = () => {
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
    
    router.push(`/explore?${params.toString()}`);
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setDateRange({ from: undefined, to: undefined });
    setPriceRange([0, 5]);
    setSelectedAmenities([]);
    setMinRating(0);
    router.push('/explore');
  };
  
  // Apply filters when they change
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      applyFilters();
    }, 500);
    
    return () => clearTimeout(debounceTimer);
  }, [priceRange, minRating]);

  return (
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
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                applyFilters();
              }
            }}
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
              onSelect={(range) => {
                if (range) {
                  setDateRange({
                    from: range.from,
                    to: range.to || undefined
                  });
                }
              }}
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
        
        {/* Search Button */}
        <div className="flex justify-end">
          <Button onClick={applyFilters}>
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
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
            <div className="mt-4 flex justify-end">
              <Button size="sm" onClick={applyFilters}>Apply</Button>
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
  );
}
