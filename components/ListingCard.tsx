'use client';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Listing } from '@/app/types';
import { MapPin, PenTool as Token } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ListingCardProps {
  listing: Listing;
}

export default function ListingCard({ listing }: ListingCardProps) {
  const router = useRouter();

  const handleBookNow = () => {
    router.push(`/listing/${listing.id}`);
  };

  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={listing.images[0]}
          alt={listing.title}
          className="object-cover w-full h-full transition-transform hover:scale-105 cursor-pointer"
          onClick={handleBookNow}
        />
      </div>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold">{listing.title}</h3>
            <div className="flex items-center text-muted-foreground">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm">{listing.location}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Token className="h-5 w-5 text-primary" />
            <span className="font-semibold">{listing.price}/night</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground line-clamp-2">{listing.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {listing.amenities.slice(0, 3).map((amenity) => (
            <span
              key={amenity}
              className="px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-xs"
            >
              {amenity}
            </span>
          ))}
          {listing.amenities.length > 3 && (
            <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-xs">
              +{listing.amenities.length - 3} more
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={listing.host.avatar} alt={listing.host.name} />
            <AvatarFallback>{listing.host.name[0]}</AvatarFallback>
          </Avatar>
          <div className="text-sm">
            <p className="font-medium">{listing.host.name}</p>
            <p className="text-muted-foreground">{listing.host.tokens} tokens earned</p>
          </div>
        </div>
        <Button onClick={handleBookNow}>Book Now</Button>
      </CardFooter>
    </Card>
  );
}