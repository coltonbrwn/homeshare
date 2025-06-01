import { Suspense } from 'react';
import { notFound, redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PenTool, User, MapPin, Mail, Phone, Calendar, Home } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { format } from 'date-fns';
import { currentUser } from '@clerk/nextjs';
import Link from 'next/link';

// Server component to fetch user data
async function ProfileContent() {
  const clerkUser = await currentUser();
  
  if (!clerkUser) {
    redirect('/sign-in');
  }
  
  const user = await prisma.user.findUnique({
    where: { id: clerkUser.id },
    include: {
      listings: true,
      bookings: true,
    },
  });

  if (!user) {
    notFound();
  }

  const listingsCount = user.listings.length;
  const bookingsCount = user.bookings.length;
  const joinDate = format(new Date(user.createdAt), 'MMMM yyyy');

  return (
    <div className="max-w-5xl mx-auto px-4">
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        {/* Profile Image and Basic Info */}
        <div className="md:w-1/3">
          <Card>
            <CardContent className="pt-6 flex flex-col items-center">
              <div className="relative mb-4">
                <Avatar className="h-32 w-32 border-4 border-primary">
                  <AvatarImage src={user.avatar || ''} alt={user.name} />
                  <AvatarFallback className="text-4xl">{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
              
              <h1 className="text-2xl font-bold mb-1">{user.name}</h1>
              {user.location && (
                <div className="flex items-center text-muted-foreground mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{user.location}</span>
                </div>
              )}
              <div className="flex items-center text-primary mb-4">
                <PenTool className="h-5 w-5 mr-2" />
                <span className="font-medium">{user.tokens} tokens earned</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Member since {joinDate}
              </p>
              
              <Button 
                variant="outline" 
                className="w-full" 
                asChild
              >
                <Link href="/profile/edit">Edit Profile</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Account Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <PenTool className="h-5 w-5 text-primary mr-2" />
                    <span>Tokens</span>
                  </div>
                  <span className="font-medium">{user.tokens}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Home className="h-5 w-5 text-primary mr-2" />
                    <span>Listings</span>
                  </div>
                  <span className="font-medium">{listingsCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-primary mr-2" />
                    <span>Bookings</span>
                  </div>
                  <span className="font-medium">{bookingsCount}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Profile Details */}
        <div className="md:w-2/3">
          <Card>
            <CardHeader>
              <CardTitle>About Me</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">{user.bio || 'No bio provided yet.'}</p>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Contact Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-muted-foreground mr-2" />
                    <span>{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-muted-foreground mr-2" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                  {user.location && (
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
                      <span>{user.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">My Listings</CardTitle>
              </CardHeader>
              <CardContent>
                {listingsCount > 0 ? (
                  <p>{listingsCount} active listings</p>
                ) : (
                  <p className="text-muted-foreground">You haven't created any listings yet.</p>
                )}
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href="/dashboard/listings">
                    {listingsCount > 0 ? 'View My Listings' : 'Create a Listing'}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">My Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                {bookingsCount > 0 ? (
                  <p>{bookingsCount} bookings</p>
                ) : (
                  <p className="text-muted-foreground">You haven't made any bookings yet.</p>
                )}
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={bookingsCount > 0 ? '/dashboard/bookings' : '/explore'}>
                    {bookingsCount > 0 ? 'View My Bookings' : 'Explore Listings'}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-background py-12">
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading profile...</div>}>
        <ProfileContent />
      </Suspense>
    </main>
  );
}
