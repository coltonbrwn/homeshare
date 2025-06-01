'use server'

import { prisma } from '@/lib/prisma';
import { Listing, User, Booking } from '@/app/types';

// Listings
export async function getListings(): Promise<Listing[]> {
  const listings = await prisma.listing.findMany({
    include: {
      host: true,
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
    available: {
      from: listing.availableFrom.toISOString().split('T')[0],
      to: listing.availableTo.toISOString().split('T')[0],
    },
  }));
}

export async function getListingById(id: string): Promise<Listing | null> {
  const listing = await prisma.listing.findUnique({
    where: { id },
    include: {
      host: true,
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
    available: {
      from: listing.availableFrom.toISOString().split('T')[0],
      to: listing.availableTo.toISOString().split('T')[0],
    },
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
    available: {
      from: listing.availableFrom.toISOString().split('T')[0],
      to: listing.availableTo.toISOString().split('T')[0],
    },
  }));
}
