import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Home, Calendar, Settings, Edit, BookOpen } from 'lucide-react';
import { getListingById, getBookingsCountForListing } from '@/app/actions';
import AvailabilityManager from '@/components/AvailabilityManager';
import AvailabilityCalendar from '@/components/AvailabilityCalendar';
import ListingEditForm from '@/components/ListingEditForm';

async function ListingManagementContent({ id }: { id: string }) {
  const listing = await getListingById(id);
  const bookingsCount = await getBookingsCountForListing(id);
  
  if (!listing) {
    notFound();
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
      </div>
      
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="md:w-1/3 h-64 md:h-auto relative rounded-lg overflow-hidden">
          <Image
            src={listing.images[0]}
            alt={listing.title}
            fill
            className="object-cover"
          />
        </div>
        
        <div className="md:w-2/3">
          <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
          <p className="text-muted-foreground mb-4">{listing.location}</p>
          <div className="flex items-center text-primary mb-4">
            <Home className="h-5 w-5 mr-2" />
            <span className="font-medium">${listing.price} per night</span>
          </div>

          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/bookings">
              <Calendar className="mr-2 h-4 w-4" />
              Manage Bookings ({bookingsCount})
            </Link>
          </Button>

        </div>
      </div>
      
      <Tabs defaultValue="availability" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="availability">
            <Calendar className="h-4 w-4 mr-2" />
            Availability
          </TabsTrigger>
          <TabsTrigger value="calendar">
            <Calendar className="h-4 w-4 mr-2" />
            Calendar View
          </TabsTrigger>
          <TabsTrigger value="edit">
            <Edit className="h-4 w-4 mr-2" />
            Edit Listing
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="availability" className="mt-6">
          <AvailabilityManager 
            listingId={listing.id} 
            availability={listing.availability}
          />
        </TabsContent>
        
        <TabsContent value="calendar" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Availability Calendar</h3>
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
        </TabsContent>
        
        <TabsContent value="edit" className="mt-6">
          <ListingEditForm listing={listing} />
        </TabsContent>
      </Tabs>
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
