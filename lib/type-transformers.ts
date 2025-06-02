import type { 
  User, 
  Listing, 
  Booking, 
  BookingWithDetails,
  Availability,
  PrismaUser,
  PrismaListing,
  PrismaBooking,
  PrismaAvailability
} from '@/app/types';

// Type-safe transformers for converting Prisma types to application types

export function transformUser(prismaUser: PrismaUser): User {
  return {
    id: prismaUser.id,
    name: prismaUser.name,
    email: prismaUser.email,
    avatar: prismaUser.avatar || '',
    tokens: prismaUser.tokens || 0,
    location: prismaUser.location || '',
    bio: prismaUser.bio || '',
    phone: prismaUser.phone || '',
    createdAt: prismaUser.createdAt.toISOString(),
    updatedAt: prismaUser.updatedAt.toISOString(),
  };
}

export function transformListing(
  prismaListing: PrismaListing & {
    host: PrismaUser;
    availability: PrismaAvailability[];
  }
): Listing {
  return {
    id: prismaListing.id,
    title: prismaListing.title,
    description: prismaListing.description,
    location: prismaListing.location,
    price: prismaListing.price,
    images: JSON.parse(prismaListing.images),
    amenities: JSON.parse(prismaListing.amenities),
    host: {
      id: prismaListing.host.id,
      name: prismaListing.host.name,
      avatar: prismaListing.host.avatar || '',
      tokens: prismaListing.host.tokens || 0,
      email: prismaListing.host.email,
      phone: prismaListing.host.phone || undefined,
    },
    availability: prismaListing.availability.map(avail => ({
      id: avail.id,
      startDate: avail.startDate.toISOString().split('T')[0],
      endDate: avail.endDate.toISOString().split('T')[0],
    })),
    createdAt: prismaListing.createdAt.toISOString(),
    updatedAt: prismaListing.updatedAt.toISOString(),
  };
}

export function transformAvailability(prismaAvailability: PrismaAvailability): Availability {
  return {
    id: prismaAvailability.id,
    startDate: prismaAvailability.startDate.toISOString().split('T')[0],
    endDate: prismaAvailability.endDate.toISOString().split('T')[0],
  };
}

export function transformBooking(
  prismaBooking: PrismaBooking & {
    user: PrismaUser;
    listing: PrismaListing & {
      host: PrismaUser;
      availability: PrismaAvailability[];
    };
  }
): Booking {
  return {
    id: prismaBooking.id,
    startDate: prismaBooking.checkIn.toISOString().split('T')[0],
    endDate: prismaBooking.checkOut.toISOString().split('T')[0],
    totalPrice: prismaBooking.tokensEarned,
    status: prismaBooking.status,
    listing: transformListing(prismaBooking.listing),
    user: transformUser(prismaBooking.user),
    createdAt: prismaBooking.createdAt.toISOString(),
    updatedAt: prismaBooking.updatedAt.toISOString(),
  };
}

export function transformBookingWithDetails(
  prismaBooking: PrismaBooking & {
    user: PrismaUser;
    listing: PrismaListing & {
      host: PrismaUser;
      availability: PrismaAvailability[];
    };
  }
): BookingWithDetails {
  const baseBooking = transformBooking(prismaBooking);
  
  // Calculate nights
  const checkIn = new Date(prismaBooking.checkIn);
  const checkOut = new Date(prismaBooking.checkOut);
  const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  
  return {
    ...baseBooking,
    nights,
    guests: 1, // Default to 1 guest for now (can be extended later)
    hasReview: false, // Default to false (can be extended with review system)
  };
}

// Utility functions for safe JSON parsing
export function safeParseJSON<T>(jsonString: string, fallback: T): T {
  try {
    return JSON.parse(jsonString);
  } catch {
    return fallback;
  }
}

export function safeStringifyJSON(data: any): string {
  try {
    return JSON.stringify(data);
  } catch {
    return '[]';
  }
}

// Type guards for runtime type checking
export function isPrismaUser(obj: any): obj is PrismaUser {
  return obj && 
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.email === 'string' &&
    typeof obj.tokens === 'number' &&
    obj.createdAt instanceof Date &&
    obj.updatedAt instanceof Date;
}

export function isPrismaListing(obj: any): obj is PrismaListing {
  return obj && 
    typeof obj.id === 'string' &&
    typeof obj.title === 'string' &&
    typeof obj.description === 'string' &&
    typeof obj.location === 'string' &&
    typeof obj.price === 'number' &&
    typeof obj.images === 'string' &&
    typeof obj.amenities === 'string' &&
    typeof obj.hostId === 'string' &&
    obj.createdAt instanceof Date &&
    obj.updatedAt instanceof Date;
}

export function isPrismaBooking(obj: any): obj is PrismaBooking {
  return obj && 
    typeof obj.id === 'string' &&
    obj.checkIn instanceof Date &&
    obj.checkOut instanceof Date &&
    typeof obj.status === 'string' &&
    typeof obj.tokensEarned === 'number' &&
    typeof obj.userId === 'string' &&
    typeof obj.listingId === 'string' &&
    obj.createdAt instanceof Date &&
    obj.updatedAt instanceof Date;
}
