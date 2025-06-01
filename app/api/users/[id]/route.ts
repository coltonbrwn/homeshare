import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth, clerkClient } from '@clerk/nextjs';

// GET user by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    
    // Check if the user is authenticated and requesting their own data
    if (!userId || userId !== params.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const user = await prisma.user.findUnique({
      where: { id: params.id },
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

// PATCH update user
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    
    // Check if the user is authenticated and updating their own data
    if (!userId || userId !== params.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const data = await request.json();
    
    // Validate the data
    const { name, bio, location, phone, hasCompletedOnboarding } = data;
    
    // Update user in database
    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: {
        name,
        bio,
        location,
        phone,
        updatedAt: new Date(),
      },
    });
    
    // If onboarding is completed, update Clerk metadata
    if (hasCompletedOnboarding) {
      await clerkClient.users.updateUser(userId, {
        unsafeMetadata: {
          onboardingComplete: true,
        },
      });
    }
    
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}
