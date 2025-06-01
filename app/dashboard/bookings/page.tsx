import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, MapPin, Home, ArrowRight, Loader2 } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { format } from 'date-fns';

async function BookingsContent() {
  const clerkUser = await currentUser();
  
  if (!clerkUser) {
    redirect('/sign-in');
  }
  
  const user = await prisma.user.findUnique({
    where: { id: clerkUser.id },
    include: {
      bookings: {
        include: {
          listing: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
  });
  
  if (!user) {
    redirect('/onboarding');
  }
  
  // Separate bookings into upcoming and past
  const now = new Date();
  const upcomingBookings = user.bookings.filter(booking => new Date(booking.endDate) >= now);
  const pastBookings = user.bookings.filter(booking => new Date(booking.endDate) < now);
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Bookings</h1>
        <Button asChild>
          <Link href="/explore">
            Find New Places
          </Link>
        </Button>
      </div>
      
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="upcoming" className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Upcoming ({upcomingBookings.length})
          </TabsTrigger>
          <TabsTrigger value="past" className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Past ({pastBookings.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming">
          {upcomingBookings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingBookings.map((booking) => (
                <BookingCard 
                  key={booking.id} 
                  booking={booking} 
                  isPast={false} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-muted rounded-lg">
              <h2 className="text-xl font-semibold mb-2">No Upcoming Bookings</h2>
              <p className="text-muted-foreground mb-6">
                You don&apos;t have any upcoming bookings. Explore available listings to book your next stay.
              </p>
              <Button asChild>
                <Link href="/explore">
                  Explore Listings
                </Link>
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="past">
          {pastBookings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastBookings.map((booking) => (
                <BookingCard 
                  key={booking.id} 
                  booking={booking} 
                  isPast={true} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-muted rounded-lg">
              <h2 className="text-xl font-semibold mb-2">No Past Bookings</h2>
              <p className="text-muted-foreground mb-6">
                You haven&apos;t completed any bookings yet.
              </p>
              <Button asChild>
                <Link href="/explore">
                  Explore Listings
                </Link>
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function BookingCard({ booking, isPast }) {
  return (
    <Card className="overflow-hidden">
      <div className="h-48 relative">
        <Image
          src={booking.listing.images[0]}
          alt={booking.listing.title}
          fill
          className="object-cover"
        />
        <div className="absolute top-2 right-2">
          <Badge variant={isPast ? "secondary" : "primary"}>
            {isPast ? "Completed" : "Upcoming"}
          </Badge>
        </div>
      </div>
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-2">{booking.listing.title}</h2>
        <div className="flex items-center text-muted-foreground mb-2">
          <MapPin className="h-4 w-4 mr-2" />
          <span>{booking.listing.location}</span>
        </div>
        <div className="flex items-center text-primary mb-2">
          <Calendar className="h-4 w-4 mr-2" />
          <span>
            {format(new Date(booking.startDate), 'MMM d, yyyy')} 
            <ArrowRight className="inline h-3 w-3 mx-1" /> 
            {format(new Date(booking.endDate), 'MMM d, yyyy')}
          </span>
        </div>
        <div className="flex items-center">
          <Home className="h-4 w-4 mr-2 text-muted-foreground" />
          <span className="font-medium">{booking.totalPrice} tokens</span>
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full space-y-2">
          <Button variant="outline" className="w-full" asChild>
            <Link href={`/listing/${booking.listing.id}`}>
              View Listing
            </Link>
          </Button>
          
          {!isPast && (
            <Button variant="outline" className="w-full">
              Contact Host
            </Button>
          )}
          
          {isPast && (
            <Button variant="outline" className="w-full" disabled={booking.hasReview}>
              {booking.hasReview ? "Review Submitted" : "Leave a Review"}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}

export default function BookingsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
          <span>Loading bookings...</span>
        </div>
      }>
        <BookingsContent />
      </Suspense>
    </main>
  );
}