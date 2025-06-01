'use client';

import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, PenTool, Home, ArrowLeft } from 'lucide-react';
import { MOCK_HOSTS } from '@/app/mock-data';
import { MOCK_LISTINGS } from '@/app/mock-data';
import ListingCard from '@/components/ListingCard';

export default function HostProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  
  const host = MOCK_HOSTS.find(host => host.id == id);
  const hostListings = MOCK_LISTINGS.filter(listing => listing.host.id === id);
  
  if (!host) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Host not found</h2>
          <Button onClick={() => router.push('/community')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Community
          </Button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Button 
          variant="ghost" 
          className="mb-8" 
          onClick={() => router.push('/community')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Community
        </Button>
        
        {/* Host Profile Header */}
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <Avatar className="h-32 w-32 border-4 border-primary">
            <AvatarImage src={host.avatar} alt={host.name} />
            <AvatarFallback className="text-4xl">{host.name.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <div>
            <h1 className="text-4xl font-bold mb-2">{host.name}</h1>
            <div className="flex items-center text-muted-foreground mb-2">
              <MapPin className="h-5 w-5 mr-2" />
              <span>{host.location}</span>
            </div>
            <div className="flex items-center text-primary mb-4">
              <PenTool className="h-5 w-5 mr-2" />
              <span className="font-medium text-lg">{host.tokens} tokens earned</span>
            </div>
            <div className="flex items-center text-muted-foreground mb-6">
              <Home className="h-5 w-5 mr-2" />
              <span>{host.listingsCount} {host.listingsCount === 1 ? 'listing' : 'listings'}</span>
            </div>
            <p className="text-lg max-w-2xl">{host.bio}</p>
          </div>
        </div>
        
        {/* Host Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-primary">{host.tokens}</p>
                <p className="text-muted-foreground">Tokens Earned</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-primary">{host.listingsCount}</p>
                <p className="text-muted-foreground">Active Listings</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-primary">4.9</p>
                <p className="text-muted-foreground">Average Rating</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Host Listings */}
        <h2 className="text-3xl font-bold mb-6">{host.name}&apos;s Listings</h2>
        {hostListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hostListings.map(listing => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-muted rounded-lg">
            <p className="text-muted-foreground">No listings available at the moment.</p>
          </div>
        )}
      </div>
    </main>
  );
}