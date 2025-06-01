import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Home, Calendar, Settings } from 'lucide-react';
import { getListingById } from '@/app/actions';
import AvailabilityManager from '@/components/AvailabilityManager';

async function ListingManagementContent({ id }: { id: string }) {
  const listing = await getListingById(id);
  
  if (!listing) {
    notFound();
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Button 
        variant="ghost" 
        className="mb-8" 
        asChild
      >
        <Link href="/dashboard/listings">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to My Listings
        </Link>
      </Button>
      
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
          <p className="text-lg">{listing.description}</p>
        </div>
      </div>
      
      <Tabs defaultValue="availability" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="availability">
            <Calendar className="h-4 w-4 mr-2" />
            Availability
          </TabsTrigger>
          <TabsTrigger value="bookings">
            <Calendar className="h-4 w-4 mr-2" />
            Bookings
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="availability" className="mt-6">
          <AvailabilityManager 
            listingId={listing.id} 
            availability={listing.availability}
          />
        </TabsContent>
        
        <TabsContent value="bookings" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center py-12 text-muted-foreground">
                Booking management coming soon
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center py-12 text-muted-foreground">
                Listing settings coming soon
              </p>
            </CardContent>
          </Card>
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