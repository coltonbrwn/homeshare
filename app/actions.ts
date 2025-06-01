'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import type { User, Listing, Availability } from '@/app/types';
import { auth } from '@clerk/nextjs';

// Listings
export async function getListings(): Promise<Listing[]> {
  const listings = await prisma.listing.findMany({
    include: {
      host: true,
      availability: true,
    },
  });
  
  return listings.map(listing => ({
    id: listing.id,
    title: listing.title,
    description: listing.description,
    location: listing.location,
    price: listing.price,
    images: JSON.parse(listing.images),
    amenities: JSON.parse(listing.amenities),
    host: {
      id: listing.host.id,
      name: listing.host.name,
      avatar: listing.host.avatar || '',
      tokens: listing.host.tokens || 0,
    },
    availability: listing.availability.map(avail => ({
      id: avail.id,
      startDate: avail.startDate.toISOString().split('T')[0],
      endDate: avail.endDate.toISOString().split('T')[0],
    })),
  }));
}

export async function getListingById(id: string): Promise<Listing | null> {
  const listing = await prisma.listing.findUnique({
    where: { id },
    include: {
      host: true,
      availability: true,
    },
  });
  
  if (!listing) return null;
  
  return {
    id: listing.id,
    title: listing.title,
    description: listing.description,
    location: listing.location,
    price: listing.price,
    images: JSON.parse(listing.images),
    amenities: JSON.parse(listing.amenities),
    host: {
      id: listing.host.id,
      name: listing.host.name,
      avatar: listing.host.avatar || '',
      tokens: listing.host.tokens,
    },
    availability: listing.availability.map(avail => ({
      id: avail.id,
      startDate: avail.startDate.toISOString().split('T')[0],
      endDate: avail.endDate.toISOString().split('T')[0],
    })),
  };
}

export async function getHosts(): Promise<User[]> {
  const hosts = await prisma.user.findMany({
    include: {
      listings: true,
    },
  });
  
  return hosts.map(host => ({
    id: host.id,
    name: host.name,
    email: host.email,
    avatar: host.avatar || '',
    tokens: host.tokens || 0,
    location: host.location || '',
    bio: host.bio || '',
    listingsCount: host.listings.length,
    listings: host.listings.map(listing => ({
      id: listing.id,
      title: listing.title,
    })),
    bookings: [], // We'll fetch these separately when needed
  }));
}

export async function getHostById(id: string): Promise<User | null> {
  const host = await prisma.user.findUnique({
    where: { id },
    include: {
      listings: true,
    },
  });
  
  if (!host) return null;
  
  return {
    id: host.id,
    name: host.name,
    email: host.email,
    avatar: host.avatar || '',
    tokens: host.tokens,
    location: host.location || 'Location not specified',
    bio: host.bio || '',
    listingsCount: host.listings.length,
    listings: host.listings.map(listing => ({
      id: listing.id,
      title: listing.title,
      // We'll fetch full listing details separately when needed
    })) as any[],
    bookings: [], // We'll fetch these separately when needed
  };
}

export async function getListingsByHostId(hostId: string): Promise<Listing[]> {
  const listings = await prisma.listing.findMany({
    where: { hostId },
    include: {
      host: true,
      availability: true,
    },
  });
  
  return listings.map(listing => ({
    id: listing.id,
    title: listing.title,
    description: listing.description,
    location: listing.location,
    price: listing.price,
    images: JSON.parse(listing.images),
    amenities: JSON.parse(listing.amenities),
    host: {
      id: listing.host.id,
      name: listing.host.name,
      avatar: listing.host.avatar || '',
      tokens: listing.host.tokens,
    },
    availability: listing.availability.map(avail => ({
      id: avail.id,
      startDate: avail.startDate.toISOString().split('T')[0],
      endDate: avail.endDate.toISOString().split('T')[0],
    })),
  }));
}

// Add a new function to manage availability
export async function addAvailabilityPeriod(data: {
  listingId: string;
  startDate: string;
  endDate: string;
}): Promise<Availability> {
  const availability = await prisma.availability.create({
    data: {
      listingId: data.listingId,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
    },
  });
  
  return {
    id: availability.id,
    startDate: availability.startDate.toISOString().split('T')[0],
    endDate: availability.endDate.toISOString().split('T')[0],
    listingId: availability.listingId,
  };
}

export async function removeAvailabilityPeriod(id: string): Promise<void> {
  await prisma.availability.delete({
    where: { id },
  });
}

// Add a new function to create a listing
export async function createListing(data: {
  title: string;
  description: string;
  location: string;
  price: number;
  amenities: string[];
  images: string[];
}): Promise<Listing> {
  const { userId } = auth();
  
  if (!userId) {
    throw new Error('Unauthorized');
  }
  
  // Create the listing
  const listing = await prisma.listing.create({
    data: {
      title: data.title,
      description: data.description,
      location: data.location,
      price: data.price,
      amenities: JSON.stringify(data.amenities),
      images: JSON.stringify(data.images),
      hostId: userId,
    },
  });
  
  // Add a default availability period (next 3 months)
  const startDate = new Date();
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + 3);
  
  await prisma.availability.create({
    data: {
      listingId: listing.id,
      startDate,
      endDate,
    },
  });
  
  // Format the listing for return
  return {
    id: listing.id,
    title: listing.title,
    description: listing.description,
    location: listing.location,
    price: listing.price,
    amenities: JSON.parse(listing.amenities),
    images: JSON.parse(listing.images),
    hostId: listing.hostId,
    availability: [{
      id: 'default',
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      listingId: listing.id,
    }],
    host: {
      id: userId,
      name: 'Current User',
      avatar: '',
      tokens: 0,
    },
    createdAt: listing.createdAt.toISOString(),
    updatedAt: listing.updatedAt.toISOString(),
  };
}

// User profile actions
export async function getUserById(id: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      listings: true,
      bookings: true,
    },
  });
  
  if (!user) return null;
  
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar || '',
    tokens: user.tokens || 0,
    location: user.location || '',
    bio: user.bio || '',
    phone: user.phone || '',
    joinDate: user.createdAt.toISOString(),
    listings: user.listings.map(listing => ({
      id: listing.id,
      title: listing.title,
      // We'll fetch full listing details separately when needed
    })) as any[],
    bookings: user.bookings.map(booking => ({
      id: booking.id,
      listingId: booking.listingId,
      // We'll fetch full booking details separately when needed
    })) as any[],
  };
}

export async function updateUserProfile(
  userId: string, 
  data: {
    name: string;
    email: string;
    phone: string | null;
    location: string | null;
    bio: string | null;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    // Update the user in the database
    await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        location: data.location,
        bio: data.bio,
        updatedAt: new Date(), // Update the updatedAt timestamp
      },
    });
    
    // Revalidate the profile page to show the updated data
    revalidatePath('/profile');
    
    return { success: true };
  } catch (error) {
    console.error('Failed to update profile:', error);
    return { success: false, error: 'Failed to update profile' };
  }
}

// Update listing images
export async function updateListingImages(data: {
  id: string;
  images: string[];
}): Promise<Listing> {
  const { userId } = auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  // Verify that the listing belongs to the current user
  const existingListing = await prisma.listing.findUnique({
    where: {
      id: data.id,
      hostId: userId,
    },
  });

  if (!existingListing) {
    throw new Error('Listing not found or you do not have permission to update it');
  }

  // Update the listing images
  const updatedListing = await prisma.listing.update({
    where: { id: data.id },
    data: {
      images: JSON.stringify(data.images),
      updatedAt: new Date(),
    },
    include: {
      host: true,
      availability: true,
    },
  });

  // Revalidate the listing page
  revalidatePath(`/listing/${data.id}`);
  revalidatePath(`/dashboard/listings/${data.id}`);

  // Format the listing for return
  return {
    id: updatedListing.id,
    title: updatedListing.title,
    description: updatedListing.description,
    location: updatedListing.location,
    price: updatedListing.price,
    images: JSON.parse(updatedListing.images),
    amenities: JSON.parse(updatedListing.amenities),
    host: {
      id: updatedListing.host.id,
      name: updatedListing.host.name,
      avatar: updatedListing.host.avatar || '',
      tokens: updatedListing.host.tokens || 0,
    },
    availability: updatedListing.availability.map(avail => ({
      id: avail.id,
      startDate: avail.startDate.toISOString().split('T')[0],
      endDate: avail.endDate.toISOString().split('T')[0],
    })),
    createdAt: updatedListing.createdAt.toISOString(),
    updatedAt: updatedListing.updatedAt.toISOString(),
  };
}

// Update a listing
export async function updateListing(data: {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  amenities: string[];
}): Promise<Listing> {
  const { userId } = auth();
  
  if (!userId) {
    throw new Error('Unauthorized');
  }
  
  // Verify that the listing belongs to the current user
  const existingListing = await prisma.listing.findUnique({
    where: {
      id: data.id,
      hostId: userId,
    },
  });
  
  if (!existingListing) {
    throw new Error('Listing not found or you do not have permission to update it');
  }
  
  // Update the listing
  const updatedListing = await prisma.listing.update({
    where: { id: data.id },
    data: {
      title: data.title,
      description: data.description,
      location: data.location,
      price: data.price,
      amenities: JSON.stringify(data.amenities),
      updatedAt: new Date(),
    },
    include: {
      host: true,
      availability: true,
    },
  });
  
  // Revalidate the listing page
  revalidatePath(`/listing/${data.id}`);
  revalidatePath(`/dashboard/listings/${data.id}`);
  
  // Format the listing for return
  return {
    id: updatedListing.id,
    title: updatedListing.title,
    description: updatedListing.description,
    location: updatedListing.location,
    price: updatedListing.price,
    images: JSON.parse(updatedListing.images),
    amenities: JSON.parse(updatedListing.amenities),
    host: {
      id: updatedListing.host.id,
      name: updatedListing.host.name,
      avatar: updatedListing.host.avatar || '',
      tokens: updatedListing.host.tokens || 0,
    },
    availability: updatedListing.availability.map(avail => ({
      id: avail.id,
      startDate: avail.startDate.toISOString().split('T')[0],
      endDate: avail.endDate.toISOString().split('T')[0],
    })),
    createdAt: updatedListing.createdAt.toISOString(),
    updatedAt: updatedListing.updatedAt.toISOString(),
  };
}

// Get bookings for a listing
export async function getBookingsForListing(listingId: string) {
  const { userId } = auth();
  
  if (!userId) {
    throw new Error('Unauthorized');
  }
  
  // Verify that the listing belongs to the current user
  const listing = await prisma.listing.findUnique({
    where: {
      id: listingId,
      hostId: userId,
    },
  });
  
  if (!listing) {
    throw new Error('Listing not found or you do not have permission to access it');
  }
  
  // Get all bookings for this listing
  const bookings = await prisma.booking.findMany({
    where: {
      listingId,
    },
    include: {
      user: true,
    },
    orderBy: {
      checkIn: 'asc',
    },
  });
  
  return bookings.map(booking => ({
    id: booking.id,
    listingId: booking.listingId,
    userId: booking.userId,
    checkIn: booking.checkIn.toISOString().split('T')[0],
    checkOut: booking.checkOut.toISOString().split('T')[0],
    status: booking.status,
    tokensEarned: booking.tokensEarned,
    createdAt: booking.createdAt.toISOString(),
    user: {
      id: booking.user.id,
      name: booking.user.name,
      avatar: booking.user.avatar || '',
    },
  }));
}

// Get all listings for the current user
export async function getUserListings(): Promise<Listing[]> {
  const { userId } = auth();
  
  if (!userId) {
    throw new Error('Unauthorized');
  }
  
  const listings = await prisma.listing.findMany({
    where: {
      hostId: userId,
    },
    include: {
      host: true,
      availability: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  
  return listings.map(listing => ({
    id: listing.id,
    title: listing.title,
    description: listing.description,
    location: listing.location,
    price: listing.price,
    images: JSON.parse(listing.images),
    amenities: JSON.parse(listing.amenities),
    host: {
      id: listing.host.id,
      name: listing.host.name,
      avatar: listing.host.avatar || '',
      tokens: listing.host.tokens || 0,
    },
    availability: listing.availability.map(avail => ({
      id: avail.id,
      startDate: avail.startDate.toISOString().split('T')[0],
      endDate: avail.endDate.toISOString().split('T')[0],
    })),
    createdAt: listing.createdAt.toISOString(),
    updatedAt: listing.updatedAt.toISOString(),
  }));
}

// Get the number of bookings for a specific listing
export async function getBookingsCountForListing(listingId: string): Promise<number> {
  const { userId } = auth();
  
  if (!userId) {
    throw new Error('Unauthorized');
  }
  
  // First verify that the listing belongs to the current user
  const listing = await prisma.listing.findUnique({
    where: {
      id: listingId,
      hostId: userId,
    },
  });
  
  if (!listing) {
    throw new Error('Listing not found or you do not have permission to access it');
  }
  
  // Count the bookings for this listing
  const bookingsCount = await prisma.booking.count({
    where: {
      listingId,
    },
  });
  
  return bookingsCount;
}
