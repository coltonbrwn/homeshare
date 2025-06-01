import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const hosts = await prisma.user.findMany({
      include: {
        listings: {
          select: {
            id: true,
          },
        },
      },
    });
    
    // Transform the data to match the expected format
    const formattedHosts = hosts.map(host => ({
      id: host.id,
      name: host.name,
      email: host.email,
      avatar: host.avatar || '',
      tokens: host.tokens || 0,
      location: host.location || '',
      bio: host.bio || '',
      listingsCount: host.listings.length,
      createdAt: host.createdAt.toISOString(),
      updatedAt: host.updatedAt.toISOString(),
    }));
    
    return NextResponse.json(formattedHosts);
  } catch (error) {
    console.error('Error fetching hosts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hosts' },
      { status: 500 }
    );
  }
}