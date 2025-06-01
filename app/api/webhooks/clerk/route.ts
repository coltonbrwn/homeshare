import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// Add logging to help debug webhook issues
export async function POST(req: Request) {
  console.log('Webhook received from Clerk');
  
  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // Log headers for debugging
  console.log('Webhook headers:', {
    'svix-id': svix_id,
    'svix-timestamp': svix_timestamp,
    'svix-signature': svix_signature?.substring(0, 10) + '...' // Log partial signature for security
  });

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error('Missing svix headers');
    return new Response('Error: Missing svix headers', {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);
  
  // Log event type for debugging
  console.log('Webhook event type:', payload.type);

  // Create a new Svix instance with your webhook secret
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  
  if (!webhookSecret) {
    console.error('CLERK_WEBHOOK_SECRET is not defined');
    return new Response('Error: Webhook secret is not configured', {
      status: 500,
    });
  }
  
  const wh = new Webhook(webhookSecret);

  let evt: WebhookEvent;

  // Verify the webhook
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
    console.log('Webhook verified successfully');
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error verifying webhook', {
      status: 400,
    });
  }

  // Handle the webhook
  const eventType = evt.type;
  console.log(`Processing ${eventType} event`);

  if (eventType === 'user.created') {
    const { id, email_addresses, image_url, first_name, last_name } = evt.data;
    console.log(`Creating user in database: ${id}`);
    
    // Create a new user in your database
    try {
      const user = await prisma.user.create({
        data: {
          id: id,
          name: `${first_name || ''} ${last_name || ''}`.trim() || 'User',
          email: email_addresses[0].email_address,
          avatar: image_url,
          tokens: 0,
          bio: '', // Empty bio by default
          location: '', // Empty location by default
          phone: '', // Empty phone by default
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      
      console.log(`User created successfully: ${user.id}`);
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Error creating user:', error);
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      );
    }
  }

  if (eventType === 'user.updated') {
    const { id, email_addresses, image_url, first_name, last_name } = evt.data;
    console.log(`Updating user in database: ${id}`);
    
    // Update the user in your database
    try {
      const user = await prisma.user.update({
        where: { id: id },
        data: {
          name: `${first_name || ''} ${last_name || ''}`.trim() || 'User',
          email: email_addresses[0].email_address,
          avatar: image_url,
          updatedAt: new Date(),
        },
      });
      
      console.log(`User updated successfully: ${user.id}`);
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Error updating user:', error);
      return NextResponse.json(
        { error: 'Failed to update user' },
        { status: 500 }
      );
    }
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data;
    console.log(`Deleting user from database: ${id}`);
    
    // Delete the user from your database
    try {
      await prisma.user.delete({
        where: { id: id },
      });
      
      console.log(`User deleted successfully: ${id}`);
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Error deleting user:', error);
      return NextResponse.json(
        { error: 'Failed to delete user' },
        { status: 500 }
      );
    }
  }

  console.log('Webhook processed successfully');
  return NextResponse.json({ success: true });
}
