import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Plus, Home, MapPin, Calendar } from 'lucide-react';
import { getUserListings } from '@/app/actions';

export default async function ListingsPage() {
  const listings = await getUserListings();
  
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Listings</h1>
            <p className="text-muted-foreground mt-1">
              Manage your properties and availability
            </p>
          </div>
          
          <Button asChild>
            <Link href="/dashboard/listings/new">
              <Plus className="mr-2 h-4 w-4" />
              Add New Listing
            </Link>
          </Button>
        </div>
        
        {listings.length === 0 ? (
          <div className="text-center py-12">
            <Home className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-medium mb-2">No listings yet</h2>
            <p className="text-muted-foreground mb-6">
              Create your first listing to start hosting guests
            </p>
            <Button asChild>
              <Link href="/dashboard/listings/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Listing
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <Card key={listing.id} className="overflow-hidden">
                <div className="aspect-video relative">
                  <Image
                    src={listing.images[0]}
                    alt={listing.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-2 line-clamp-1">{listing.title}</h2>
                  <p className="text-muted-foreground mb-4 flex items-center">
                    <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span className="line-clamp-1">{listing.location}</span>
                  </p>
                  <p className="text-primary font-medium mb-2">${listing.price} per night</p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>
                      {listing.availability.length} availability {listing.availability.length === 1 ? 'period' : 'periods'}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="px-6 py-4 bg-muted/50 flex justify-between">
                  <Button variant="outline" asChild>
                    <Link href={`/listing/${listing.id}`}>
                      View Listing
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link href={`/dashboard/listings/${listing.id}`}>
                      Manage
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
