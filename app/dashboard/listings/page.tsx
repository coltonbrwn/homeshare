import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Plus, Home, Calendar } from 'lucide-react';
import { getListingsByHostId } from '@/app/actions';

// For demo purposes, we'll use a hardcoded user ID
// In a real app, you would get this from the authenticated user
const DEMO_USER_ID = "101";

async function ListingsContent() {
  const listings = await getListingsByHostId(DEMO_USER_ID);
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Listings</h1>
        <Button asChild>
          <Link href="/dashboard/listings/new">
            <Plus className="mr-2 h-4 w-4" />
            Add New Listing
          </Link>
        </Button>
      </div>
      
      {listings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <Card key={listing.id} className="overflow-hidden">
              <div className="h-48 relative">
                <Image
                  src={listing.images[0]}
                  alt={listing.title}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-2">{listing.title}</h2>
                <p className="text-muted-foreground mb-2">{listing.location}</p>
                <div className="flex items-center text-primary">
                  <Home className="h-4 w-4 mr-2" />
                  <span className="font-medium">${listing.price} per night</span>
                </div>
                <div className="flex items-center text-muted-foreground mt-2">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{listing.availability.length} availability periods</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/dashboard/listings/${listing.id}`}>
                    Manage Listing
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-muted rounded-lg">
          <h2 className="text-xl font-semibold mb-2">No Listings Yet</h2>
          <p className="text-muted-foreground mb-6">
            You haven&apos;t created any listings yet. Get started by adding your first property.
          </p>
          <Button asChild>
            <Link href="/dashboard/listings/new">
              <Plus className="mr-2 h-4 w-4" />
              Add New Listing
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}

export default function ListingsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading listings...</div>}>
        <ListingsContent />
      </Suspense>
    </main>
  );
}