/* eslint-disable @next/next/no-img-element */
import { Suspense } from 'react';
import SearchBar from '@/components/SearchBar';
import ListingCard from '@/components/ListingCard';
import { getListings } from '@/app/actions';
import Image from 'next/image';

// Server Component for fetching and displaying listings
async function FeaturedListings() {
  const listings = await getListings();
  const featuredListings = listings.slice(0, 6); // Get first 6 listings
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {featuredListings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[500px] bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1501183638710-841dd1904471?ixlib=rb-4.0.3"
            alt="Hero background"
            fill
            priority
            className="object-cover opacity-20"
          />
        </div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Share Your Home, Earn Tokens
          </h1>
          <p className="text-xl text-white/90 mb-8">
            Join our community-driven home-sharing network
          </p>
          <SearchBar />
        </div>
      </div>

      {/* Listings Section */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-6">Featured Homes</h2>
        <Suspense fallback={<div className="text-center py-12">Loading featured listings...</div>}>
          <FeaturedListings />
        </Suspense>
      </section>
    </main>
  );
}
