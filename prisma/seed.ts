import { PrismaClient } from '@prisma/client';
import { MOCK_USERS, MOCK_LISTINGS, MOCK_AVAILABILITIES, MOCK_BOOKINGS } from '../app/mock-data';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Clear existing data
  console.log('Clearing existing data...');
  await prisma.booking.deleteMany();
  await prisma.availability.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.user.deleteMany();

  console.log('Creating users...');
  // Create users
  for (const user of MOCK_USERS) {
    await prisma.user.create({
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        tokens: user.tokens,
        location: user.location,
        bio: user.bio,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    console.log(`Created user: ${user.name}`);
  }

  console.log('Creating listings...');
  // Create listings
  for (const listing of MOCK_LISTINGS) {
    await prisma.listing.create({
      data: {
        id: listing.id,
        title: listing.title,
        description: listing.description,
        location: listing.location,
        price: listing.price,
        images: JSON.stringify(listing.images),
        amenities: JSON.stringify(listing.amenities),
        hostId: listing.hostId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    console.log(`Created listing: ${listing.title}`);
  }

  console.log('Creating availabilities...');
  // Create availability periods
  for (const availability of MOCK_AVAILABILITIES) {
    await prisma.availability.create({
      data: {
        id: availability.id,
        listingId: availability.listingId,
        startDate: new Date(availability.startDate),
        endDate: new Date(availability.endDate),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    console.log(`Created availability for listing: ${availability.listingId}`);
  }

  console.log('Creating bookings...');
  // Create bookings
  for (const booking of MOCK_BOOKINGS) {
    await prisma.booking.create({
      data: {
        id: booking.id,
        userId: booking.userId,
        listingId: booking.listingId,
        checkIn: new Date(booking.checkIn),
        checkOut: new Date(booking.checkOut),
        status: booking.status,
        tokensEarned: booking.tokensEarned,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    console.log(`Created booking: ${booking.id}`);
  }

  console.log('Database has been seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });