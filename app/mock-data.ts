export const MOCK_LISTINGS = [
  {
    id: '1',
    title: 'Modern Downtown Loft',
    description: 'Stunning loft in the heart of the city with panoramic views. This spacious apartment features floor-to-ceiling windows, modern furnishings, and all the amenities you need for a comfortable stay. Perfect for both business travelers and tourists looking to explore the city.',
    location: 'New York, NY',
    price: 1,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3',
    ],
    amenities: ['WiFi', 'Kitchen', 'Air Conditioning', 'Washer'],
    host: {
      id: '101',
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3',
      tokens: 45
    },
    available: {
      from: '2024-04-01',
      to: '2024-04-30'
    }
  },
  {
    id: '2',
    title: 'Cozy Beach House',
    description: 'Beautiful beachfront property with direct access to the ocean. Wake up to the sound of waves and enjoy stunning sunsets from your private deck. This fully equipped beach house offers a perfect escape for those seeking a relaxing coastal getaway.',
    location: 'Miami Beach, FL',
    price: 1,
    images: [
      'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3',
    ],
    amenities: ['Beach Access', 'Pool', 'BBQ', 'Parking'],
    host: {
      id: '102',
      name: 'Michael Smith',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3',
      tokens: 32
    },
    available: {
      from: '2024-04-01',
      to: '2024-04-30'
    }
  },
];