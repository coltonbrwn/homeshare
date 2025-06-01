'use client';

import { useState } from 'react';
import { Search, CalendarDays } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import ListingCard from '@/components/ListingCard';
import { Listing } from './types';

const MOCK_LISTINGS: Listing[] = [
  {
    id: '1',
    title: 'Modern Downtown Loft',
    description: 'Stunning loft in the heart of the city with panoramic views',
    location: 'New York, NY',
    price: 1,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3',
    ],
    amenities: ['WiFi', 'Kitchen', 'Air Conditioning', 'Washer'],
    host: {
      id: '101',
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3',
      tokens: 45
    },
    available: {
      from: '2024-04-01',
      to: '2024-04-30'
    }
  },
  {
    id: '2',
    title: 'Cozy Beach House',
    description: 'Beautiful beachfront property with direct access to the ocean',
    location: 'Miami Beach, FL',
    price: 1,
    images: [
      'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3',
    ],
    amenities: ['Beach Access', 'Pool', 'BBQ', 'Parking'],
    host: {
      id: '102',
      name: 'Michael Smith',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3',
      tokens: 32
    },
    available: {
      from: '2024-04-01',
      to: '2024-04-30'
    }
  },
];

export default function Home() {
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[500px] bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1501183638710-841dd1904471?ixlib=rb-4.0.3"
            alt="Hero background"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Share Your Home, Earn Tokens
          </h1>
          <p className="text-xl text-white/90 mb-8">
            Join our community-driven home-sharing network
          </p>
          <div className="max-w-2xl mx-auto flex gap-2 bg-white p-2 rounded-lg shadow-lg">
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
            <Button size="lg">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>
        </div>
      </div>

      {/* Listings Section */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-6">Featured Homes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_LISTINGS.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>
    </main>
  );
}