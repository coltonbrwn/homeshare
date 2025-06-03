'use client';

import { Suspense, useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Home, Calendar, Camera, Clock, CheckCircle, XCircle, User, PenTool } from 'lucide-react';
import { getListingById, getBookingsCountForListing, getBookingsForListing } from '@/app/actions';
import AvailabilityManager from '@/components/AvailabilityManager';
import AvailabilityCalendar from '@/components/AvailabilityCalendar';
import ListingEditForm from '@/components/ListingEditForm';
import PhotoUploadManager from '@/components/PhotoUploadManager';
import { format } from 'date-fns';

// BookingCard component for displaying individual bookings
function BookingCard({ booking }: { booking: any }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold">{booking.user.name}</h4>
              <p className="text-sm text-muted-foreground">{booking.user.email}</p>
            </div>
          </div>
          <Badge className={`${getStatusColor(booking.status)} flex items-center gap-1`}>
            {getStatusIcon(booking.status)}
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Check-in</p>
            <p className="font-medium">{format(new Date(booking.startDate), 'MMM d, yyyy')}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Check-out</p>
            <p className="font-medium">{format(new Date(booking.endDate), 'MMM d, yyyy')}</p>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="flex items-center gap-1">
            <PenTool className="h-4 w-4 text-primary" />
            <span className="font-medium">{booking.totalPrice} tokens</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Booked {format(new Date(booking.createdAt), 'MMM d, yyyy')}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ListingManagementContent({ id }: { id: string }) {
  const [listing, setListing] = useState<any>(null);
  const [bookingsCount, setBookingsCount] = useState<number>(0);
  const [bookings, setBookings] = useState<any[]>([]);
  const [isEditingPhotos, setIsEditingPhotos] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bookingsLoading, setBookingsLoading] = useState(false);

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

  const fetchBookings = async () => {
    setBookingsLoading(true);
    try {
      const bookingsData = await getBookingsForListing(id);
      setBookings(bookingsData);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setBookingsLoading(false);
    }
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

  // Categorize bookings into past and upcoming
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingBookings = bookings.filter(booking => {
    const checkInDate = new Date(booking.startDate);
    return checkInDate >= today;
  });

  const pastBookings = bookings.filter(booking => {
    const checkOutDate = new Date(booking.endDate);
    return checkOutDate < today;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
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

      {/* Tabs for Listing Management and Bookings */}
      <Tabs defaultValue="manage" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="manage" className="flex items-center">
            <Home className="h-4 w-4 mr-2" />
            Manage Listing
          </TabsTrigger>
          <TabsTrigger value="bookings" className="flex items-center" onClick={fetchBookings}>
            <Calendar className="h-4 w-4 mr-2" />
            Bookings ({bookingsCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="manage">
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
        </TabsContent>

        <TabsContent value="bookings">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Property Bookings</h2>
              <div className="text-sm text-muted-foreground">
                Total: {bookingsCount} booking{bookingsCount !== 1 ? 's' : ''}
              </div>
            </div>

            {bookingsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-muted-foreground">Loading bookings...</p>
                </div>
              </div>
            ) : bookings.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No bookings yet</h3>
                  <p className="text-muted-foreground">
                    Your property hasn&apos;t received any bookings yet. Make sure your availability is set up correctly.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Tabs defaultValue="upcoming" className="w-full">
                <TabsList className="mb-6">
                  <TabsTrigger value="upcoming" className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Upcoming ({upcomingBookings.length})
                  </TabsTrigger>
                  <TabsTrigger value="past" className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Past ({pastBookings.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="upcoming">
                  <div className="space-y-4">
                    {upcomingBookings.length === 0 ? (
                      <Card>
                        <CardContent className="pt-6 text-center py-8">
                          <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-muted-foreground">No upcoming bookings</p>
                        </CardContent>
                      </Card>
                    ) : (
                      upcomingBookings.map((booking) => (
                        <BookingCard key={booking.id} booking={booking} />
                      ))
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="past">
                  <div className="space-y-4">
                    {pastBookings.length === 0 ? (
                      <Card>
                        <CardContent className="pt-6 text-center py-8">
                          <CheckCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-muted-foreground">No past bookings</p>
                        </CardContent>
                      </Card>
                    ) : (
                      pastBookings.map((booking) => (
                        <BookingCard key={booking.id} booking={booking} />
                      ))
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </TabsContent>
      </Tabs>

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
