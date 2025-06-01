import { Suspense } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, Calendar, User, PenTool, LayoutDashboard } from 'lucide-react';
import { MOCK_USERS } from '@/app/mock-data';

// Use Sarah Johnson (user1) as the default user
const defaultUser = MOCK_USERS[0];

// Use data from mock data
const userData = {
  name: defaultUser.name,
  tokens: defaultUser.tokens,
  listingsCount: 1, // Sarah has one listing in our mock data
  bookingsCount: 0, // We can assume no bookings yet
};

function DashboardContent() {
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
            <p className="text-muted-foreground">Host since June 2023</p>
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
          <Link href="/settings" className="flex flex-col items-start">
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
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading dashboard...</div>}>
        <DashboardContent />
      </Suspense>
    </main>
  );
}
