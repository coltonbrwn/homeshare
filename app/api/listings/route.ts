import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const listings = await prisma.listing.findMany({
      include: {
        host: true,
        availability: true,
      },
    });
    
    // Transform the data to match the expected format
    const formattedListings = listings.map(listing => ({
      id: listing.id,
      title: listing.title,
      description: listing.description,
      location: listing.location,
      price: listing.price,
      images: JSON.parse(listing.images as string),
      amenities: JSON.parse(listing.amenities as string),
      host: {
        id: listing.host.id,
        name: listing.host.name,
        avatar: listing.host.avatar || '',
        tokens: listing.host.tokens,
      },
      availability: listing.availability.map(a => ({
        id: a.id,
        startDate: a.startDate.toISOString(),
        endDate: a.endDate.toISOString(),
      })),
      createdAt: listing.createdAt.toISOString(),
      updatedAt: listing.updatedAt.toISOString(),
    }));
    
    return NextResponse.json(formattedListings);
  } catch (error) {
    console.error('Error fetching listings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch listings' },
      { status: 500 }
    );
  }
}
