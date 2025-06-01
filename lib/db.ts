import prisma from './prisma';
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

// Users/Hosts
export async function getHosts(): Promise<User[]> {
  const users = await prisma.user.findMany({
    include: {
      listings: true,
      bookings: true,
    },
  });
  
  return users.map(user => ({
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar || '',
    tokens: user.tokens,
    listings: [], // We'll fetch these separately when needed
    bookings: [], // We'll fetch these separately when needed
  }));
}

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
    tokens: user.tokens,
    listings: [], // We'll fetch these separately when needed
    bookings: [], // We'll fetch these separately when needed
  };
}

// Bookings
export async function createBooking(data: {
  userId: string;
  listingId: string;
  checkIn: string;
  checkOut: string;
}): Promise<Booking> {
  const booking = await prisma.booking.create({
    data: {
      userId: data.userId,
      listingId: data.listingId,
      checkIn: new Date(data.checkIn),
      checkOut: new Date(data.checkOut),
      status: 'pending',
      tokensEarned: 0,
    },
    include: {
      user: true,
      listing: true,
    },
  });
  
  return {
    id: booking.id,
    listingId: booking.listingId,
    userId: booking.userId,
    checkIn: booking.checkIn.toISOString().split('T')[0],
    checkOut: booking.checkOut.toISOString().split('T')[0],
    status: booking.status as 'pending' | 'confirmed' | 'completed' | 'cancelled',
    tokensEarned: booking.tokensEarned,
  };
}
