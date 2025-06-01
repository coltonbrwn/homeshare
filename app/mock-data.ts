// Mock users/hosts
export const MOCK_USERS = [
  {
    id: 'user1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3',
    tokens: 45,
    location: 'New York, NY',
    bio: 'Passionate about sharing my downtown loft with travelers from around the world.',
    phone: '+1 (212) 555-1234',
  },
  {
    id: 'user2',
    name: 'Michael Smith',
    email: 'michael.smith@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3',
    tokens: 32,
    location: 'Miami Beach, FL',
    bio: 'Beach lover and proud owner of a beautiful oceanfront property.',
    phone: '+1 (305) 555-6789',
  },
  {
    id: 'user3',
    name: 'Emma Wilson',
    email: 'emma.wilson@example.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3',
    tokens: 67,
    location: 'San Francisco, CA',
    bio: 'Tech professional sharing my modern apartment in the heart of SF.',
    phone: '+1 (415) 555-4321',
  },
  {
    id: 'user4',
    name: 'David Chen',
    email: 'david.chen@example.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3',
    tokens: 28,
    location: 'Chicago, IL',
    bio: 'Architecture enthusiast with a renovated historic home in downtown Chicago.',
    phone: '+1 (312) 555-8765',
  },
  {
    id: 'user5',
    name: 'Olivia Martinez',
    email: 'olivia.martinez@example.com',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3',
    tokens: 51,
    location: 'Austin, TX',
    bio: 'Music lover sharing my cozy home near all the best venues in Austin.',
    phone: '+1 (512) 555-9876',
  },
  {
    id: 'user6',
    name: 'James Wilson',
    email: 'james.wilson@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3',
    tokens: 39,
    location: 'Seattle, WA',
    bio: 'Coffee enthusiast with a modern apartment overlooking Puget Sound.',
    phone: '+1 (206) 555-3456',
  },
];

// Mock listings
export const MOCK_LISTINGS = [
  {
    id: 'listing1',
    title: 'Modern Downtown Loft',
    description: 'Stunning loft in the heart of the city with panoramic views.',
    location: 'New York, NY',
    price: 2,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3',
    ],
    amenities: ['WiFi', 'Kitchen', 'Air Conditioning', 'TV'],
    hostId: 'user1',
  },
  {
    id: 'listing2',
    title: 'Cozy Beach House',
    description: 'Beautiful beachfront property with direct access to the ocean.',
    location: 'Miami Beach, FL',
    price: 3,
    images: [
      'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3',
    ],
    amenities: ['Beach Access', 'WiFi', 'Kitchen', 'Parking'],
    hostId: 'user2',
  },
  {
    id: 'listing3',
    title: 'Mountain Cabin Retreat',
    description: 'Secluded cabin in the mountains with breathtaking views.',
    location: 'Aspen, CO',
    price: 4,
    images: [
      'https://images.unsplash.com/photo-1518732714860-b62714ce0c59?ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3',
    ],
    amenities: ['WiFi', 'Kitchen', 'Air Conditioning', 'Parking'],
    hostId: 'user3',
  },
  {
    id: 'listing4',
    title: 'Historic Downtown Apartment',
    description: 'Charming apartment in a historic building with original features.',
    location: 'Chicago, IL',
    price: 1,
    images: [
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3',
    ],
    amenities: ['WiFi', 'Kitchen', 'Coffee Maker', 'TV'],
    hostId: 'user4',
  },
  {
    id: 'listing5',
    title: 'Lakefront Cottage',
    description: 'Peaceful cottage on the lake with private dock.',
    location: 'Lake Tahoe, CA',
    price: 5,
    images: [
      'https://images.unsplash.com/photo-1475113548554-5a36f1f523d6?ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?ixlib=rb-4.0.3',
    ],
    amenities: ['Beach Access', 'WiFi', 'Kitchen', 'Parking'],
    hostId: 'user5',
  },
];

// Mock availabilities
export const MOCK_AVAILABILITIES = [
  {
    id: 'avail1',
    listingId: 'listing1',
    startDate: '2024-04-01',
    endDate: '2024-06-30',
  },
  {
    id: 'avail2',
    listingId: 'listing1',
    startDate: '2024-08-01',
    endDate: '2024-10-31',
  },
  {
    id: 'avail3',
    listingId: 'listing2',
    startDate: '2024-05-01',
    endDate: '2024-08-31',
  },
  {
    id: 'avail4',
    listingId: 'listing3',
    startDate: '2024-06-01',
    endDate: '2024-09-30',
  },
  {
    id: 'avail5',
    listingId: 'listing4',
    startDate: '2024-04-15',
    endDate: '2024-07-15',
  },
  {
    id: 'avail6',
    listingId: 'listing4',
    startDate: '2024-09-01',
    endDate: '2024-12-15',
  },
  {
    id: 'avail7',
    listingId: 'listing5',
    startDate: '2024-05-15',
    endDate: '2024-10-15',
  },
];

// Mock bookings
export const MOCK_BOOKINGS = [
  {
    id: 'booking1',
    userId: 'user6', // James Wilson
    listingId: 'listing1', // Modern Downtown Loft
    checkIn: '2024-04-10',
    checkOut: '2024-04-15',
    status: 'completed',
    tokensEarned: 10
  },
  {
    id: 'booking2',
    userId: 'user3', // Emma Wilson
    listingId: 'listing2', // Cozy Beach House
    checkIn: '2024-06-01',
    checkOut: '2024-06-07',
    status: 'confirmed',
    tokensEarned: 21
  },
  {
    id: 'booking3',
    userId: 'user4', // David Chen
    listingId: 'listing3', // Mountain Cabin Retreat
    checkIn: '2024-07-15',
    checkOut: '2024-07-22',
    status: 'pending',
    tokensEarned: 0
  },
  {
    id: 'booking4',
    userId: 'user5', // Olivia Martinez
    listingId: 'listing1', // Modern Downtown Loft
    checkIn: '2024-05-20',
    checkOut: '2024-05-25',
    status: 'confirmed',
    tokensEarned: 10
  },
  {
    id: 'booking5',
    userId: 'user2', // Michael Smith
    listingId: 'listing5', // Lakefront Cottage
    checkIn: '2024-06-10',
    checkOut: '2024-06-17',
    status: 'cancelled',
    tokensEarned: 0
  },
];
