import { Suspense } from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getListingById } from '@/app/actions';
import { MapPin, PenTool as Token, Wifi, Utensils as Kitchen, Wind, Waves } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import BookingForm from '@/components/BookingForm';

// Map of amenity names to their icon components
const amenityIcons: Record<string, any> = {
  'WiFi': Wifi,
  'Kitchen': Kitchen,
  'Air Conditioning': Wind,
  'Beach Access': Waves,
};

async function ListingContent({ id }: { id: string }) {
  const listing = await getListingById(id);
  
  if (!listing) {
    notFound();
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">{listing.title}</h1>
      <div className="flex items-center text-muted-foreground mb-8">
        <MapPin className="h-5 w-5 mr-2" />
        <span>{listing.location}</span>
      </div>

      {/* Image Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
          <Image
            src={listing.images[0]}
            alt={`${listing.title} - Main Image`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            className="object-cover"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {listing.images.slice(1, 5).map((image, index) => (
            <div
              key={index}
              className="relative aspect-[4/3] overflow-hidden rounded-lg"
            >
              <Image
                src={image}
                alt={`${listing.title} - Image ${index + 2}`}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover"
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
              <BookingForm
                listingId={listing.id}
                listingPrice={listing.price}
                availability={listing.availability}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function ListingDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading listing details...</div>}>
        <ListingContent id={params.id} />
      </Suspense>
    </div>
  );
}
