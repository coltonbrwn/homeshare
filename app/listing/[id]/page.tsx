'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarDays, MapPin, PenTool as Token, Wifi, Twitch as Kitchen, Wind, Waves } from 'lucide-react';
import { format } from 'date-fns';
import { MOCK_LISTINGS } from '@/app/mock-data';
import { Listing } from '@/app/types';

export default function ListingDetail() {
  const { id } = useParams();
  const listing = MOCK_LISTINGS.find((l) => l.id === id) as Listing;

  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!listing) {
    return <div>Listing not found</div>;
  }

  const amenityIcons: { [key: string]: any } = {
    'WiFi': Wifi,
    'Kitchen': Kitchen,
    'Air Conditioning': Wind,
    'Beach Access': Waves,
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-4">{listing.title}</h1>
        <div className="flex items-center text-muted-foreground mb-8">
          <MapPin className="h-5 w-5 mr-2" />
          <span>{listing.location}</span>
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
            <img
              src={listing.images[currentImageIndex]}
              alt={`${listing.title} - Image ${currentImageIndex + 1}`}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {listing.images.map((image, index) => (
              <div
                key={index}
                className="relative aspect-[4/3] overflow-hidden rounded-lg cursor-pointer"
                onClick={() => setCurrentImageIndex(index)}
              >
                <img
                  src={image}
                  alt={`${listing.title} - Image ${index + 1}`}
                  className="object-cover w-full h-full hover:opacity-90 transition-opacity"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2">
            <div className="prose max-w-none">
              <h2 className="text-2xl font-semibold mb-4">About this home</h2>
              <p className="text-muted-foreground mb-6">{listing.description}</p>

              <h3 className="text-xl font-semibold mb-4">Amenities</h3>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {listing.amenities.map((amenity) => {
                  const IconComponent = amenityIcons[amenity] || Token;
                  return (
                    <div key={amenity} className="flex items-center gap-2">
                      <IconComponent className="h-5 w-5 text-primary" />
                      <span>{amenity}</span>
                    </div>
                  );
                })}
              </div>

              <h3 className="text-xl font-semibold mb-4">Host</h3>
              <div className="flex items-center gap-4 mb-8">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={listing.host.avatar} alt={listing.host.name} />
                  <AvatarFallback>{listing.host.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-lg">{listing.host.name}</p>
                  <p className="text-muted-foreground">
                    {listing.host.tokens} tokens earned
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Token className="h-6 w-6 text-primary" />
                    <span className="text-2xl font-bold">{listing.price}</span>
                  </div>
                  <span className="text-muted-foreground">token per night</span>
                </div>
              </CardHeader>
              <CardContent>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal ${
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
                        "Select your stay dates"
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
              </CardContent>
              <CardFooter>
                <Button className="w-full" size="lg">
                  Book your stay
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}