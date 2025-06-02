'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  CheckCircle, Calendar, MapPin, Home, ArrowLeft, 
  User, Clock, CreditCard, Loader2, PenTool
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { getListingById, getBookingWithDetails } from '@/app/actions';
import { Listing, BookingWithDetails } from '@/app/types';

function BookingSuccessContent() {
  const searchParams = useSearchParams();
  const [booking, setBooking] = useState<BookingWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const bookingId = searchParams.get('bookingId');
  const listingId = searchParams.get('listingId');
  const checkInParam = searchParams.get('checkIn');
  const checkOutParam = searchParams.get('checkOut');

  useEffect(() => {
    async function fetchBookingData() {
      try {
        if (bookingId) {
          // New flow: fetch actual booking data
          const bookingData = await getBookingWithDetails(bookingId);
          if (!bookingData) {
            setError('Booking not found');
          } else {
            setBooking(bookingData);
          }
        } else if (listingId && checkInParam && checkOutParam) {
          // Legacy flow: create mock booking data from URL parameters
          const listingData = await getListingById(listingId);
          if (!listingData) {
            setError('Listing not found');
          } else {
            // Create a mock booking object for display
            const checkInDate = new Date(checkInParam);
            const checkOutDate = new Date(checkOutParam);
            const nights = differenceInDays(checkOutDate, checkInDate);

            const mockBooking: BookingWithDetails = {
              id: 'mock-booking',
              startDate: checkInDate.toISOString().split('T')[0],
              endDate: checkOutDate.toISOString().split('T')[0],
              totalPrice: nights * listingData.price,
              status: 'pending',
              listing: listingData,
              user: {
                id: 'current-user',
                name: 'Current User',
                email: 'user@example.com',
                avatar: '',
                tokens: 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              nights,
              guests: 1,
              hasReview: false,
            };
            setBooking(mockBooking);
          }
        } else {
          setError('Missing booking parameters');
        }
      } catch (err) {
        console.error('Error fetching booking data:', err);
        setError('Failed to load booking details');
      } finally {
        setLoading(false);
      }
    }

    fetchBookingData();
  }, [bookingId, listingId, checkInParam, checkOutParam]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <span>Loading booking confirmation...</span>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Booking Error</h2>
            <p className="text-muted-foreground mb-4">
              {error || 'Unable to load booking details'}
            </p>
            <Button asChild>
              <Link href="/explore">
                Return to Explore
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Parse dates from booking
  const checkInDate = new Date(booking.startDate);
  const checkOutDate = new Date(booking.endDate);
  const nights = booking.nights;
  const totalPrice = booking.totalPrice;

  const formattedCheckIn = format(checkInDate, 'EEEE, MMMM d, yyyy');
  const formattedCheckOut = format(checkOutDate, 'EEEE, MMMM d, yyyy');

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
        <p className="text-muted-foreground">
          Your booking request has been submitted successfully. You'll receive a confirmation email shortly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Listing Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Your Booking
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Listing Image */}
            <div className="relative h-48 w-full rounded-lg overflow-hidden">
              {booking.listing.images.length > 0 ? (
                <Image
                  src={booking.listing.images[0]}
                  alt={booking.listing.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <p className="text-muted-foreground">No image available</p>
                </div>
              )}
            </div>

            {/* Listing Info */}
            <div>
              <h3 className="text-xl font-semibold mb-2">{booking.listing.title}</h3>
              <div className="flex items-center text-muted-foreground mb-2">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{booking.listing.location}</span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {booking.listing.description}
              </p>
            </div>

            {/* Host Info */}
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">{booking.listing.host.name}</p>
                <p className="text-sm text-muted-foreground">Your host</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Booking Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Booking Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Dates */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Check-in</span>
                <span className="font-medium">{formattedCheckIn}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Check-out</span>
                <span className="font-medium">{formattedCheckOut}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Duration</span>
                <span className="font-medium">{nights} night{nights !== 1 ? 's' : ''}</span>
              </div>
            </div>

            <Separator />

            {/* Pricing */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {booking.listing.price} tokens × {nights} night{nights !== 1 ? 's' : ''}
                </span>
                <span className="font-medium">{totalPrice} tokens</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>Total</span>
                <div className="flex items-center gap-1">
                  <PenTool className="h-4 w-4 text-primary" />
                  <span>{totalPrice} tokens</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Status */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                <Clock className="h-3 w-3 mr-1" />
                {booking.status === 'confirmed' ? 'Confirmed' : 'Pending Confirmation'}
              </Badge>
            </div>

            {/* Payment Info */}
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-2">
                <CreditCard className="h-4 w-4 text-blue-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-blue-900">Payment Information</p>
                  <p className="text-blue-700">
                    Tokens will be deducted from your account once the host confirms your booking.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
        <Button variant="outline" asChild>
          <Link href="/dashboard/bookings">
            View My Bookings
          </Link>
        </Button>
        <Button asChild>
          <Link href="/explore">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continue Exploring
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default function BookingSuccessPage() {
  return (
    <main className="min-h-screen bg-background">
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
          <span>Loading booking confirmation...</span>
        </div>
      }>
        <BookingSuccessContent />
      </Suspense>
    </main>
  );
}
