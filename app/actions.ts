'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import type { User, Listing, Availability, Booking, BookingWithDetails } from '@/app/types';
import {
  transformUser,
  transformListing,
  transformBooking,
  transformBookingWithDetails,
  transformAvailability,
  safeStringifyJSON
} from '@/lib/type-transformers';
import { auth } from '@clerk/nextjs';

// Listings
export async function getListings(): Promise<Listing[]> {

  console.log("DATABASE URL :::::")
  console.log(process.env.DATABASE_URL)
  const listings = await prisma.listing.findMany({
    include: {
      host: true,
      availability: true,
    },
  });
  
  return listings.map(listing => transformListing(listing));
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
  
  return transformListing(listing);
}

export async function getHosts(): Promise<User[]> {
  const hosts = await prisma.user.findMany({
    include: {
      listings: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  
  return hosts.map(host => ({
    ...transformUser(host),
    listingsCount: host.listings.length
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
    createdAt: host.createdAt.toISOString(),
    updatedAt: host.updatedAt.toISOString(),
    avatar: host.avatar || '',
    tokens: host.tokens,
    location: host.location || 'Location not specified',
    bio: host.bio || '',
    phone: host.phone || ''
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
  
  return listings.map(listing => transformListing(listing));
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
  
  return transformAvailability(availability);
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

  // Check if user already has a listing (limit to 1 per user)
  const existingListing = await prisma.listing.findFirst({
    where: { hostId: userId },
  });

  if (existingListing) {
    throw new Error('You can only have one listing. Please edit your existing listing instead.');
  }

  // Create the listing
  const listing = await prisma.listing.create({
    data: {
      title: data.title,
      description: data.description,
      location: data.location,
      price: data.price,
      amenities: safeStringifyJSON(data.amenities),
      images: safeStringifyJSON(data.images),
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
  
  // Fetch the complete listing with relations for proper transformation
  const completeListing = await prisma.listing.findUnique({
    where: { id: listing.id },
    include: {
      host: true,
      availability: true,
    },
  });

  if (!completeListing) {
    throw new Error('Failed to retrieve created listing');
  }

  return transformListing(completeListing);
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
  
  return transformUser(user);
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
      images: safeStringifyJSON(data.images),
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

  return transformListing(updatedListing);
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
      amenities: safeStringifyJSON(data.amenities),
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
  
  return transformListing(updatedListing);
}

// Get bookings for a listing
export async function getBookingsForListing(listingId: string): Promise<Booking[]> {
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
    include: {
      host: true,
      availability: true,
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
      listing: {
        include: {
          host: true,
          availability: true,
        },
      },
    },
    orderBy: {
      checkIn: 'asc',
    },
  });

  return bookings.map(booking => transformBooking(booking));
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
  
  return listings.map(listing => transformListing(listing));
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

// Get a single booking by ID
export async function getBookingById(bookingId: string): Promise<Booking | null> {
  const { userId } = auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  // Get the booking and verify access
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      user: true,
      listing: {
        include: {
          host: true,
          availability: true,
        },
      },
    },
  });

  if (!booking) {
    return null;
  }

  // Verify that the user is either the booking owner or the listing host
  if (booking.userId !== userId && booking.listing.hostId !== userId) {
    throw new Error('You do not have permission to access this booking');
  }

  return transformBooking(booking);
}

// Get a single booking by ID with detailed information
export async function getBookingWithDetails(bookingId: string): Promise<BookingWithDetails | null> {
  const { userId } = auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  // Get the booking and verify access
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      user: true,
      listing: {
        include: {
          host: true,
          availability: true,
        },
      },
    },
  });

  if (!booking) {
    return null;
  }

  // Verify that the user is either the booking owner or the listing host
  if (booking.userId !== userId && booking.listing.hostId !== userId) {
    throw new Error('You do not have permission to access this booking');
  }

  return transformBookingWithDetails(booking);
}

// Get current user with token balance
export async function getCurrentUser(): Promise<User | null> {
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return null;
  }

  return transformUser(user);
}

// Update user token balance
export async function updateUserTokens(tokensToAdd: number): Promise<{ success: boolean; newBalance: number; error?: string }> {
  const { userId } = auth();

  if (!userId) {
    return { success: false, newBalance: 0, error: 'Unauthorized' };
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        tokens: {
          increment: tokensToAdd,
        },
        updatedAt: new Date(),
      },
    });

    // Revalidate relevant pages
    revalidatePath('/dashboard');
    revalidatePath('/profile');

    return { success: true, newBalance: updatedUser.tokens };
  } catch (error) {
    console.error('Error updating user tokens:', error);
    return { success: false, newBalance: 0, error: 'Failed to update tokens' };
  }
}

// Create a new booking with token validation
export async function createBookingWithTokenValidation(data: {
  listingId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
}): Promise<{ success: boolean; booking?: Booking; error?: string; insufficientTokens?: boolean; currentTokens?: number }> {
  const { userId } = auth();

  if (!userId) {
    return { success: false, error: 'Unauthorized' };
  }

  // Get current user to check token balance
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return { success: false, error: 'User not found' };
  }

  // Check if user has enough tokens
  if (user.tokens < data.totalPrice) {
    return {
      success: false,
      insufficientTokens: true,
      currentTokens: user.tokens,
      error: `Insufficient tokens. You have ${user.tokens} tokens but need ${data.totalPrice} tokens.`
    };
  }

  // Verify the listing exists and is available
  const listing = await prisma.listing.findUnique({
    where: { id: data.listingId },
    include: {
      host: true,
      availability: true,
    },
  });

  if (!listing) {
    return { success: false, error: 'Listing not found' };
  }

  // Check if the dates are available
  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);

  // Check for overlapping bookings
  const overlappingBooking = await prisma.booking.findFirst({
    where: {
      listingId: data.listingId,
      OR: [
        {
          checkIn: { lte: startDate },
          checkOut: { gt: startDate },
        },
        {
          checkIn: { lt: endDate },
          checkOut: { gte: endDate },
        },
        {
          checkIn: { gte: startDate },
          checkOut: { lte: endDate },
        },
      ],
      status: { not: 'cancelled' },
    },
  });

  if (overlappingBooking) {
    return { success: false, error: 'The selected dates are not available' };
  }

  try {
    // Use a transaction to ensure both operations succeed or fail together
    const result = await prisma.$transaction(async (tx) => {
      // Deduct tokens from user
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          tokens: {
            decrement: data.totalPrice,
          },
          updatedAt: new Date(),
        },
      });

      // Create the booking
      const booking = await tx.booking.create({
        data: {
          userId,
          listingId: data.listingId,
          checkIn: startDate,
          checkOut: endDate,
          tokensEarned: data.totalPrice,
          status: 'confirmed', // Set to confirmed since payment is immediate
        },
        include: {
          user: true,
          listing: {
            include: {
              host: true,
              availability: true,
            },
          },
        },
      });

      return { booking, updatedUser };
    });

    // Revalidate relevant pages
    revalidatePath('/dashboard/bookings');
    revalidatePath(`/dashboard/listings/${data.listingId}`);
    revalidatePath('/dashboard');

    return { success: true, booking: transformBooking(result.booking) };
  } catch (error) {
    console.error('Error creating booking:', error);
    return { success: false, error: 'Failed to create booking' };
  }
}

// Legacy function for backward compatibility
export async function createBooking(data: {
  listingId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
}): Promise<Booking> {
  const result = await createBookingWithTokenValidation(data);

  if (!result.success) {
    throw new Error(result.error || 'Failed to create booking');
  }

  if (!result.booking) {
    throw new Error('Booking creation failed');
  }

  return result.booking;
}

// Update booking status
export async function updateBookingStatus(bookingId: string, status: string): Promise<Booking> {
  const { userId } = auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  // Get the booking and verify access
  const existingBooking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      listing: true,
    },
  });

  if (!existingBooking) {
    throw new Error('Booking not found');
  }

  // Verify that the user is either the booking owner or the listing host
  if (existingBooking.userId !== userId && existingBooking.listing.hostId !== userId) {
    throw new Error('You do not have permission to update this booking');
  }

  // Update the booking
  const updatedBooking = await prisma.booking.update({
    where: { id: bookingId },
    data: {
      status,
      updatedAt: new Date(),
    },
    include: {
      user: true,
      listing: {
        include: {
          host: true,
          availability: true,
        },
      },
    },
  });

  // Revalidate relevant pages
  revalidatePath('/dashboard/bookings');
  revalidatePath(`/dashboard/bookings/${bookingId}`);
  revalidatePath(`/dashboard/listings/${updatedBooking.listingId}`);

  return transformBooking(updatedBooking);
}

// Get all bookings for the current user
export async function getUserBookings(): Promise<Booking[]> {
  const { userId } = auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  const bookings = await prisma.booking.findMany({
    where: { userId },
    include: {
      user: true,
      listing: {
        include: {
          host: true,
          availability: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return bookings.map(booking => transformBooking(booking));
}

// Get upcoming bookings for all listings owned by the current user (as host)
export async function getHostUpcomingBookings(): Promise<Booking[]> {
  const { userId } = auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const bookings = await prisma.booking.findMany({
    where: {
      listing: {
        hostId: userId,
      },
      checkIn: {
        gte: today,
      },
      status: {
        not: 'cancelled',
      },
    },
    include: {
      user: true,
      listing: {
        include: {
          host: true,
          availability: true,
        },
      },
    },
    orderBy: {
      checkIn: 'asc',
    },
  });

  return bookings.map(booking => transformBooking(booking));
}
