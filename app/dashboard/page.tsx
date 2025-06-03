import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Home, Calendar, User, PenTool, LayoutDashboard, Loader2, Clock, CheckCircle, MapPin } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { getHostUpcomingBookings } from '@/app/actions';
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
      case 'confirmed': return <CheckCircle className="h-3 w-3" />;
      case 'pending': return <Clock className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="font-medium text-sm">{booking.user.name}</p>
              <p className="text-xs text-muted-foreground">{booking.user.email}</p>
            </div>
          </div>
          <Badge className={`${getStatusColor(booking.status)} flex items-center gap-1 text-xs`}>
            {getStatusIcon(booking.status)}
            {booking.status}
          </Badge>
        </div>

        <div className="space-y-2 mb-3">
          <div className="flex items-center gap-1 text-sm">
            <Home className="h-3 w-3 text-muted-foreground" />
            <span className="font-medium truncate">{booking.listing.title}</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span className="truncate">{booking.listing.location}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs mb-3">
          <div>
            <p className="text-muted-foreground">Check-in</p>
            <p className="font-medium">{format(new Date(booking.startDate), 'MMM d')}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Check-out</p>
            <p className="font-medium">{format(new Date(booking.endDate), 'MMM d')}</p>
          </div>
        </div>

        <div className="flex justify-between items-center pt-2 border-t">
          <div className="flex items-center gap-1">
            <PenTool className="h-3 w-3 text-primary" />
            <span className="text-sm font-medium">{booking.totalPrice} tokens</span>
          </div>
          <Button asChild size="sm" variant="outline" className="h-7 text-xs">
            <Link href={`/dashboard/listings/${booking.listing.id}`}>
              View
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

async function DashboardContent() {
  const clerkUser = await currentUser();
  
  if (!clerkUser) {
    redirect('/sign-in');
  }
  
  // Check if user has completed onboarding
  const hasCompletedOnboarding = clerkUser.unsafeMetadata?.onboardingComplete === true;
  
  if (!hasCompletedOnboarding) {
    redirect('/onboarding');
  }
  
  // Try to find the user in our database
  let user = await prisma.user.findUnique({
    where: { id: clerkUser.id },
    include: {
      listings: true,
      bookings: true,
    },
  });
  
  // If user doesn't exist in our database, create them
  if (!user) {
    console.log(`User ${clerkUser.id} not found in database, creating...`);
    
    user = await prisma.user.create({
      data: {
        id: clerkUser.id,
        name: clerkUser.firstName && clerkUser.lastName 
          ? `${clerkUser.firstName} ${clerkUser.lastName}`.trim()
          : clerkUser.emailAddresses[0].emailAddress.split('@')[0],
        email: clerkUser.emailAddresses[0].emailAddress,
        avatar: clerkUser.imageUrl,
        tokens: 0,
        bio: '',
        location: '',
        phone: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      include: {
        listings: true,
        bookings: true,
      },
    });
    
    // Redirect to onboarding since this is a new user
    redirect('/onboarding');
  }
  
  // Check if user has completed profile (has bio and location)
  if (!user.bio || !user.location) {
    redirect('/onboarding');
  }
  
  // Get upcoming bookings for user's listings
  const upcomingBookings = await getHostUpcomingBookings();

  const userData = {
    name: user.name,
    tokens: user.tokens,
    listingsCount: user.listings.length,
    bookingsCount: user.bookings.length,
    upcomingHostBookings: upcomingBookings.length,
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Manage your listings, bookings, and account</p>
        </div>
        <div className="flex items-center gap-2 bg-primary/10 p-3 rounded-lg">
          <PenTool className="h-5 w-5 text-primary" />
          <span className="font-medium">{userData.tokens} tokens available</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Host Bookings
            </CardTitle>
            <CardDescription>Bookings for your properties</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{userData.upcomingHostBookings}</p>
            <p className="text-muted-foreground">upcoming check-ins</p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/dashboard/listings">Manage Properties</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5 text-primary" />
              My Listings
            </CardTitle>
            <CardDescription>Your property portfolio</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{userData.listingsCount}</p>
            <p className="text-muted-foreground">active properties</p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/dashboard/listings">View Listings</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LayoutDashboard className="h-5 w-5 text-primary" />
              My Travel
            </CardTitle>
            <CardDescription>Your guest bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{userData.bookingsCount}</p>
            <p className="text-muted-foreground">travel bookings</p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/dashboard/bookings">View Travel</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Button asChild variant="outline" className="h-auto py-4 justify-start">
          <Link href="/dashboard/listings/new" className="flex flex-col items-start">
            <span className="flex items-center gap-2 mb-1">
              <Home className="h-4 w-4" />
              Add New Listing
            </span>
            <span className="text-xs text-muted-foreground">List a new property</span>
          </Link>
        </Button>
        
        <Button asChild variant="outline" className="h-auto py-4 justify-start">
          <Link href="/dashboard/listings" className="flex flex-col items-start">
            <span className="flex items-center gap-2 mb-1">
              <Calendar className="h-4 w-4" />
              Manage Availability
            </span>
            <span className="text-xs text-muted-foreground">Update your calendar</span>
          </Link>
        </Button>
        
        <Button asChild variant="outline" className="h-auto py-4 justify-start">
          <Link href="/explore" className="flex flex-col items-start">
            <span className="flex items-center gap-2 mb-1">
              <LayoutDashboard className="h-4 w-4" />
              Browse Listings
            </span>
            <span className="text-xs text-muted-foreground">Find places to stay</span>
          </Link>
        </Button>
        
        <Button asChild variant="outline" className="h-auto py-4 justify-start">
          <Link href="/profile/edit" className="flex flex-col items-start">
            <span className="flex items-center gap-2 mb-1">
              <User className="h-4 w-4" />
              Update Profile
            </span>
            <span className="text-xs text-muted-foreground">Edit your information</span>
          </Link>
        </Button>
      </div>

      {/* Upcoming Bookings Section */}
      <div className="mt-12">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Upcoming Bookings</h2>
            <p className="text-muted-foreground">Guests checking in to your properties</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/dashboard/listings">
              <Home className="mr-2 h-4 w-4" />
              Manage Listings
            </Link>
          </Button>
        </div>

        {upcomingBookings.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No upcoming bookings</h3>
              <p className="text-muted-foreground mb-4">
                You don&apos;t have any upcoming bookings for your properties yet.
              </p>
              <Button asChild>
                <Link href="/dashboard/listings">
                  <Home className="mr-2 h-4 w-4" />
                  Manage Your Listings
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingBookings.slice(0, 6).map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}

        {upcomingBookings.length > 6 && (
          <div className="mt-4 text-center">
            <Button asChild variant="outline">
              <Link href="/dashboard/listings">
                View All Bookings
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-background">
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
          <span>Loading dashboard...</span>
        </div>
      }>
        <DashboardContent />
      </Suspense>
    </main>
  );
}
