import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const hostId = params.id;
    
    const host = await prisma.user.findUnique({
      where: { id: hostId },
      include: {
        listings: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
    
    if (!host) {
      return NextResponse.json(
        { error: 'Host not found' },
        { status: 404 }
      );
    }
    
    // Transform the data to match the expected format
    const formattedHost = {
      id: host.id,
      name: host.name,
      email: host.email,
      avatar: host.avatar || '',
      tokens: host.tokens || 0,
      location: host.location || '',
      bio: host.bio || '',
      listingsCount: host.listings.length,
      listings: host.listings,
      createdAt: host.createdAt.toISOString(),
      updatedAt: host.updatedAt.toISOString(),
    };
    
    return NextResponse.json(formattedHost);
  } catch (error) {
    console.error('Error fetching host:', error);
    return NextResponse.json(
      { error: 'Failed to fetch host' },
      { status: 500 }
    );
  }
}