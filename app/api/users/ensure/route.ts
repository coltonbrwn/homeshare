import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth, clerkClient } from '@clerk/nextjs';

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get the request body
    const { clerkId } = await request.json();
    
    // Verify that the authenticated user is requesting their own data
    if (userId !== clerkId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Check if user exists in database
    const existingUser = await prisma.user.findUnique({
      where: { id: clerkId }
    });
    
    // If user exists, return it
    if (existingUser) {
      return NextResponse.json(existingUser);
    }
    
    // User doesn't exist, get data from Clerk
    const clerkUser = await clerkClient.users.getUser(clerkId);
    
    // Create a new user in the database
    const newUser = await prisma.user.create({
      data: {
        id: clerkId,
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
    
    console.log(`User created via API: ${newUser.id}`);
    return NextResponse.json(newUser);
  } catch (error) {
    console.error('Error ensuring user exists:', error);
    return NextResponse.json(
      { error: 'Failed to ensure user exists' },
      { status: 500 }
    );
  }
}