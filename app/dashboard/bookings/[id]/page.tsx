import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Calendar, MapPin, Home, ArrowLeft, User,
  Phone, Mail, Clock, CreditCard, Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import { BookingWithDetails } from '@/app/types';
import { getBookingWithDetails } from '@/app/actions';

async function BookingDetailContent({ id }: { id: string }) {
  // Fetch the booking with related data using our type-safe action
  const booking: BookingWithDetails | null = await getBookingWithDetails(id);

  if (!booking) {
    notFound();
  }
  
  const isPast = new Date(booking.endDate) < new Date();
  const formattedStartDate = format(new Date(booking.startDate), 'MMMM d, yyyy');
  const formattedEndDate = format(new Date(booking.endDate), 'MMMM d, yyyy');
  const formattedBookingDate = format(new Date(booking.createdAt), 'MMMM d, yyyy');
  
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <Button 
        variant="ghost" 
        className="mb-8" 
        asChild
      >
        <Link href="/dashboard/bookings">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to My Bookings
        </Link>
      </Button>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left column - Booking details */}
        <div className="md:w-2/3">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-3xl font-bold">{booking.listing.title}</h1>
            <Badge variant={isPast ? "secondary" : "default"}>
              {isPast ? "Completed" : "Upcoming"}
            </Badge>
          </div>
          
          <div className="rounded-lg overflow-hidden mb-6 h-64 relative">
            <Image
              src={booking.listing.images[0]}
              alt={booking.listing.title}
              fill
              className="object-cover"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-primary" />
                  Stay Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Check-in</span>
                  <span className="font-medium">{formattedStartDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Check-out</span>
                  <span className="font-medium">{formattedEndDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium">{booking.nights} nights</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Guests</span>
                  <span className="font-medium">{booking.guests}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-primary" />
                  Payment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price per night</span>
                  <span className="font-medium">{booking.listing.price} tokens</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nights</span>
                  <span className="font-medium">× {booking.nights}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between">
                  <span className="font-medium">Total</span>
                  <span className="font-bold">{booking.totalPrice} tokens</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Home className="h-5 w-5 mr-2 text-primary" />
                Property Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 text-muted-foreground flex-shrink-0 mt-0.5" />
                <span>{booking.listing.location}</span>
              </div>
              <p>{booking.listing.description}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {booking.listing.amenities.map((amenity: string, index: number) => (
                  <Badge key={index} variant="outline">{amenity}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {isPast && !booking.hasReview && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Leave a Review</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Share your experience to help other guests make informed decisions.
                </p>
                <Button className="w-full">Write a Review</Button>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Right column - Host info and booking status */}
        <div className="md:w-1/3">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <User className="h-5 w-5 mr-2 text-primary" />
                Host Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden relative mr-3">
                  <Image
                    src={booking.listing.host.avatar || '/placeholder-avatar.png'}
                    alt={booking.listing.host.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium">{booking.listing.host.name}</p>
                  <p className="text-sm text-muted-foreground">Host</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{booking.listing.host.email}</span>
                </div>
                {booking.listing.host.phone && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{booking.listing.host.phone}</span>
                  </div>
                )}
              </div>
              
              <Button variant="outline" className="w-full">
                Contact Host
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Clock className="h-5 w-5 mr-2 text-primary" />
                Booking Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Booking ID</span>
                <span className="font-mono text-sm">{booking.id.slice(0, 8)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Booking Date</span>
                <span>{formattedBookingDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge variant={isPast ? "secondary" : "default"}>
                  {isPast ? "Completed" : "Confirmed"}
                </Badge>
              </div>
              
              {!isPast && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full">
                      Download Receipt
                    </Button>
                    <Button variant="destructive" className="w-full">
                      Cancel Booking
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function BookingDetailPage({ params }: { params: { id: string } }) {
  return (
    <main className="min-h-screen bg-background">
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
          <span>Loading booking details...</span>
        </div>
      }>
        <BookingDetailContent id={params.id} />
      </Suspense>
    </main>
  );
}