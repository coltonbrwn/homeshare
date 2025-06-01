import { prisma } from '@/lib/prisma';
import { User } from '@clerk/nextjs/server';

/**
 * Ensures a user exists in the database
 * This is a fallback in case the webhook fails
 */
export async function ensureUserExists(clerkUser: User) {
  try {
    // Check if user exists in database
    const existingUser = await prisma.user.findUnique({
      where: { id: clerkUser.id }
    });

    // If user exists, return it
    if (existingUser) {
      return existingUser;
    }

    console.log(`User ${clerkUser.id} not found in database, creating...`);
    
    // User doesn't exist, create a new one
    const newUser = await prisma.user.create({
      data: {
        id: clerkUser.id,
        name: clerkUser.firstName && clerkUser.lastName 
          ? `${clerkUser.firstName} ${clerkUser.lastName}`.trim()
          : clerkUser.emailAddresses[0].emailAddress.split('@')[0],
        email: clerkUser.emailAddresses[0].emailAddress,
        avatar: clerkUser.imageUrl,
        tokens: 0,
        bio: '',
        location: '',
        phone: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    
    console.log(`User created: ${newUser.id}`);
    return newUser;
  } catch (error) {
    console.error('Error ensuring user exists:', error);
    throw error;
  }
}