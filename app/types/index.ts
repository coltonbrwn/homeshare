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
  };
  available: {
    from: string;
    to: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  tokens: number;
  listings: Listing[];
  bookings: Booking[];
}

export interface Booking {
  id: string;
  listingId: string;
  userId: string;
  checkIn: string;
  checkOut: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  tokensEarned: number;
}