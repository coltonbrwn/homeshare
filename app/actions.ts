'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import type { User, Listing, Availability } from '@/app/types';

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
    tokens: host.tokens,
    listings: host.listings.map(listing => ({
      id: listing.id,
      title: listing.title,
      // We'll fetch full listing details separately when needed
    })) as any[],
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
