import { Suspense } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, Calendar, User, PenTool, LayoutDashboard, Loader2 } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

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
  
  const userData = {
    name: user.name,
    tokens: user.tokens,
    listingsCount: user.listings.length,
    bookingsCount: user.bookings.length,
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
              <Home className="h-5 w-5 text-primary" />
              My Listings
            </CardTitle>
            <CardDescription>Manage your properties</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{userData.listingsCount}</p>
            <p className="text-muted-foreground">active listings</p>
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
              <Calendar className="h-5 w-5 text-primary" />
              My Bookings
            </CardTitle>
            <CardDescription>Track your reservations</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{userData.bookingsCount}</p>
            <p className="text-muted-foreground">upcoming bookings</p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/dashboard/bookings">View Bookings</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              My Profile
            </CardTitle>
            <CardDescription>Manage your account</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium">{userData.name}</p>
            <p className="text-muted-foreground">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/profile">View Profile</Link>
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
