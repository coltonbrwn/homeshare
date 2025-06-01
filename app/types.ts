export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  tokens: number;
  location?: string;
  bio?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

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
}