export type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  tokens: number;
  location: string;
  bio: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
  listingsCount?: number;
};

export interface Availability {
  id: string;
  startDate: string;
  endDate: string;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  images: string[];
  amenities: string[];
  host: {
    id: string;
    name: string;
    avatar: string;
    tokens: number;
    email?: string;
    phone?: string;
  };
  availability: Availability[];
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: string;
  listing: Listing;
  user: User;
  createdAt: string;
  updatedAt: string;
  // Computed properties
  nights?: number;
  guests?: number;
  hasReview?: boolean;
}

// Extended booking type for detailed views
export interface BookingWithDetails extends Booking {
  nights: number;
  guests: number;
  hasReview: boolean;
}

// Prisma raw types (for internal use only)
export interface PrismaUser {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  tokens: number;
  location: string | null;
  bio: string | null;
  phone: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PrismaListing {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  images: string; // JSON string
  amenities: string; // JSON string
  hostId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PrismaBooking {
  id: string;
  checkIn: Date;
  checkOut: Date;
  status: string;
  tokensEarned: number;
  userId: string;
  listingId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PrismaAvailability {
  id: string;
  startDate: Date;
  endDate: Date;
  listingId: string;
  createdAt: Date;
  updatedAt: Date;
}
