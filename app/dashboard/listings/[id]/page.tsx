'use client';

import { Suspense, useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Home, Calendar, BookOpen, Camera } from 'lucide-react';
import { getListingById, getBookingsCountForListing } from '@/app/actions';
import AvailabilityManager from '@/components/AvailabilityManager';
import AvailabilityCalendar from '@/components/AvailabilityCalendar';
import ListingEditForm from '@/components/ListingEditForm';
import PhotoUploadManager from '@/components/PhotoUploadManager';

function ListingManagementContent({ id }: { id: string }) {
  const [listing, setListing] = useState<any>(null);
  const [bookingsCount, setBookingsCount] = useState<number>(0);
  const [isEditingPhotos, setIsEditingPhotos] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [listingData, bookingsData] = await Promise.all([
          getListingById(id),
          getBookingsCountForListing(id)
        ]);

        if (!listingData) {
          notFound();
          return;
        }

        setListing(listingData);
        setBookingsCount(bookingsData);
      } catch (error) {
        console.error('Error fetching listing data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  const handleImagesUpdated = (newImages: string[]) => {
    setListing((prev: any) => ({ ...prev, images: newImages }));
    setIsEditingPhotos(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading listing details...
      </div>
    );
  }

  if (!listing) {
    notFound();
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-start mb-8">
        <Button 
          variant="ghost" 
          className="mb-4" 
          asChild
        >
          <Link href="/dashboard/listings">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to My Listings
          </Link>
        </Button>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <BookOpen className="h-4 w-4" />
            <span>{bookingsCount} bookings</span>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/bookings">
              <Calendar className="mr-2 h-4 w-4" />
              View Bookings
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="md:w-1/3 h-64 md:h-auto relative rounded-lg overflow-hidden group">
          <Image
            src={listing.images[0]}
            alt={listing.title}
            fill
            className="object-cover"
          />

          {/* Photo Edit Overlay */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsEditingPhotos(true)}
              className="bg-white/90 hover:bg-white text-black"
            >
              <Camera className="mr-2 h-4 w-4" />
              Update Photos
            </Button>
          </div>

          {/* Photo count indicator */}
          {listing.images.length > 1 && (
            <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
              {listing.images.length} photos
            </div>
          )}
        </div>
        
        <div className="md:w-2/3">
          <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
          <p className="text-muted-foreground mb-4">{listing.location}</p>
          <div className="flex items-center text-primary mb-4">
            <Home className="h-5 w-5 mr-2" />
            <span className="font-medium">${listing.price} per night</span>
          </div>
          <p className="text-lg mb-4">{listing.description}</p>
          
          <div className="flex flex-wrap gap-2 mt-2">
            {listing.amenities.map((amenity: string, index: number) => (
              <Badge key={index} variant="outline">{amenity}</Badge>
            ))}
          </div>
        </div>
      </div>
      
      {/* Availability Management Section */}
      <h2 className="text-2xl font-bold mb-6">Manage Your Listing</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Availability Manager */}
        <Card>
          <CardHeader>
            <CardTitle>Manage Availability</CardTitle>
          </CardHeader>
          <CardContent>
            <AvailabilityManager 
              listingId={listing.id} 
              availability={listing.availability}
            />
          </CardContent>
        </Card>
        
        {/* Calendar View */}
        <Card>
          <CardHeader>
            <CardTitle>Availability Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              This calendar shows when your listing is available for booking.
              Green dates indicate available periods.
            </p>
            <AvailabilityCalendar 
              availability={listing.availability}
              bookings={[]} // We'll pass bookings here if needed
            />
          </CardContent>
        </Card>
      </div>
      
      {/* Edit Listing Form */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-6">Edit Listing Details</h2>
        <ListingEditForm listing={listing} />
      </div>

      {/* Photo Upload Manager Modal */}
      {isEditingPhotos && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">Update Photos</h2>
              <PhotoUploadManager
                listingId={listing.id}
                currentImages={listing.images}
                onImagesUpdated={handleImagesUpdated}
                onCancel={() => setIsEditingPhotos(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ListingManagementPage({ params }: { params: { id: string } }) {
  return (
    <main className="min-h-screen bg-background">
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading listing details...</div>}>
        <ListingManagementContent id={params.id} />
      </Suspense>
    </main>
  );
}
