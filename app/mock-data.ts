export const MOCK_LISTINGS = [
  {
    id: '1',
    title: 'Modern Downtown Loft',
    description: 'Stunning loft in the heart of the city with panoramic views. This spacious apartment features floor-to-ceiling windows, modern furnishings, and all the amenities you need for a comfortable stay.',
    location: 'New York, NY',
    price: 2,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3',
    ],
    amenities: ['WiFi', 'Kitchen', 'Air Conditioning', 'TV', 'Coffee Maker'],
    host: {
      id: '101',
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3',
      tokens: 45
    },
    available: {
      from: '2024-04-01',
      to: '2024-06-30'
    }
  },
  {
    id: '2',
    title: 'Cozy Beach House',
    description: 'Beautiful beachfront property with direct access to the ocean. Wake up to the sound of waves and enjoy stunning sunsets from your private deck.',
    location: 'Miami Beach, FL',
    price: 3,
    images: [
      'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3',
    ],
    amenities: ['Beach Access', 'WiFi', 'Kitchen', 'Parking', 'Pet Friendly'],
    host: {
      id: '102',
      name: 'Michael Smith',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3',
      tokens: 32
    },
    available: {
      from: '2024-05-01',
      to: '2024-08-31'
    }
  },
  {
    id: '3',
    title: 'Mountain Cabin Retreat',
    description: 'Secluded cabin in the mountains with breathtaking views. Perfect for hiking, relaxation, and getting away from it all.',
    location: 'Aspen, CO',
    price: 4,
    images: [
      'https://images.unsplash.com/photo-1518732714860-b62714ce0c59?ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1502672023488-70e25813eb80?ixlib=rb-4.0.3',
    ],
    amenities: ['WiFi', 'Kitchen', 'Air Conditioning', 'Parking', 'TV'],
    host: {
      id: '103',
      name: 'Emma Wilson',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3',
      tokens: 67
    },
    available: {
      from: '2024-06-01',
      to: '2024-09-30'
    }
  },
  {
    id: '4',
    title: 'Historic Downtown Apartment',
    description: 'Charming apartment in a historic building with original features and modern amenities. Walking distance to restaurants and attractions.',
    location: 'Chicago, IL',
    price: 1,
    images: [
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3',
    ],
    amenities: ['WiFi', 'Kitchen', 'Coffee Maker', 'TV'],
    host: {
      id: '104',
      name: 'David Chen',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3',
      tokens: 28
    },
    available: {
      from: '2024-04-15',
      to: '2024-07-15'
    }
  },
  {
    id: '5',
    title: 'Lakefront Cottage',
    description: 'Peaceful cottage on the lake with private dock. Perfect for fishing, swimming, and enjoying nature.',
    location: 'Lake Tahoe, CA',
    price: 5,
    images: [
      'https://images.unsplash.com/photo-1475113548554-5a36f1f523d6?ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1501876725168-00c445821c9e?ixlib=rb-4.0.3',
    ],
    amenities: ['Beach Access', 'WiFi', 'Kitchen', 'Parking', 'Pet Friendly', 'TV'],
    host: {
      id: '105',
      name: 'Olivia Martinez',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3',
      tokens: 51
    },
    available: {
      from: '2024-05-15',
      to: '2024-10-15'
    }
  }
];

// Mock data for hosts
export const MOCK_HOSTS = [
  {
    id: '101',
    name: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3',
    tokens: 45,
    location: 'New York, NY',
    bio: 'Passionate about sharing my downtown loft with travelers from around the world.',
    listingsCount: 2
  },
  {
    id: '102',
    name: 'Michael Smith',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3',
    tokens: 32,
    location: 'Miami Beach, FL',
    bio: 'Beach lover and proud owner of a beautiful oceanfront property.',
    listingsCount: 1
  },
  {
    id: '103',
    name: 'Emma Wilson',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3',
    tokens: 67,
    location: 'San Francisco, CA',
    bio: 'Tech professional sharing my modern apartment in the heart of SF.',
    listingsCount: 3
  },
  {
    id: '104',
    name: 'David Chen',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3',
    tokens: 28,
    location: 'Chicago, IL',
    bio: 'Architecture enthusiast with a renovated historic home in downtown Chicago.',
    listingsCount: 1
  },
  {
    id: '105',
    name: 'Olivia Martinez',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3',
    tokens: 51,
    location: 'Austin, TX',
    bio: 'Music lover sharing my cozy home near all the best venues in Austin.',
    listingsCount: 2
  },
  {
    id: '106',
    name: 'James Wilson',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3',
    tokens: 39,
    location: 'Seattle, WA',
    bio: 'Coffee enthusiast with a modern apartment overlooking Puget Sound.',
    listingsCount: 1
  },
];
