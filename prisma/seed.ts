import { PrismaClient } from '@prisma/client';
import { MOCK_LISTINGS, MOCK_HOSTS } from '../app/mock-data';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Clear existing data
  await prisma.availability.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.user.deleteMany();

  // Create hosts/users
  for (const host of MOCK_HOSTS) {
    await prisma.user.create({
      data: {
        id: host.id,
        name: host.name,
        email: `${host.name.toLowerCase().replace(' ', '.')}@example.com`,
        avatar: host.avatar,
        tokens: host.tokens,
        location: host.location || undefined,
        bio: host.bio || undefined,
      },
    });
  }

  // Create listings
  for (const listing of MOCK_LISTINGS) {
    const createdListing = await prisma.listing.create({
      data: {
        id: listing.id,
        title: listing.title,
        description: listing.description,
        location: listing.location,
        price: listing.price,
        images: JSON.stringify(listing.images),
        amenities: JSON.stringify(listing.amenities),
        hostId: listing.host.id,
      },
    });

    // Create availability periods
    await prisma.availability.create({
      data: {
        listingId: createdListing.id,
        startDate: new Date(listing.available.from),
        endDate: new Date(listing.available.to),
      },
    });
  }

  console.log('Database has been seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
