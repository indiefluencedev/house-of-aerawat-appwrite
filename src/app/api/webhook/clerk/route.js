// src/app/api/webhook/clerk/route.js
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { UserService } from '@/services/userService';
import {
  serverDatabases,
  DATABASE_ID,
  USERS_COLLECTION_ID,
} from '@/lib/appwrite-server';
import { ID, Query } from 'node-appwrite';

// Force Node.js runtime for this API route to support Appwrite SDK fully
export const runtime = 'nodejs';

export async function POST(req) {
  console.log('📣 Clerk webhook received');

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  console.log('📣 Headers:', {
    svix_id,
    svix_timestamp,
    svix_signature: svix_signature ? 'present' : 'missing',
  });

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occurred -- no svix headers', {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
  console.log(
    '📣 Webhook secret available:',
    !!process.env.CLERK_WEBHOOK_SECRET
  );

  let evt;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    });
    console.log('📣 Webhook payload verified successfully');
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occurred', {
      status: 400,
    });
  }

  // Handle the webhook
  const { id } = evt.data;
  const eventType = evt.type;

  console.log(`📣 Webhook with an ID of ${id} and type of ${eventType}`);
  console.log(`📣 Event data:`, JSON.stringify(evt.data));

  try {
    switch (eventType) {
      case 'user.created':
        await handleUserCreated(evt.data);
        break;
      case 'user.updated':
        await handleUserUpdated(evt.data);
        break;
      case 'user.deleted':
        await handleUserDeleted(evt.data);
        break;
      default:
        console.log(`Unhandled event type: ${eventType}`);
    }
  } catch (error) {
    console.error(`Error handling webhook ${eventType}:`, error);
    return new Response('Error processing webhook', {
      status: 500,
    });
  }

  return new Response('Success', { status: 200 });
}

async function handleUserCreated(data) {
  try {
    console.log('📣 Processing user.created webhook for:', data.id);

    // First check if user already exists (to handle potential duplicates)
    const existingUsers = await serverDatabases.listDocuments(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      [Query.equal('clerk_id', data.id)]
    );

    console.log(
      `📣 Found ${existingUsers.documents.length} existing users with clerkId ${data.id}`
    );

    if (existingUsers.documents.length > 0) {
      console.log(
        '📣 User already exists in Appwrite, skipping creation:',
        data.id
      );
      return;
    }

    console.log('📣 Creating new user in Appwrite:', {
      clerkId: data.id,
      email: data.email_addresses?.[0]?.email_address || '[no email]',
      firstName: data.first_name || '',
      lastName: data.last_name || '',
    });

    // Create new user document
    const newUser = await serverDatabases.createDocument(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      ID.unique(),
      {
        clerk_id: data.id,
        email: data.email_addresses[0]?.email_address || '',
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        profile_image: data.image_url || '',
        phone_number: data.phone_numbers[0]?.phone_number || '',
        role: 'customer',
        is_active: Boolean(true),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        email_verified:
          Boolean(
            data.email_addresses?.[0]?.verification?.status === 'verified'
          ) || Boolean(false),
      }
    );

    console.log('📣 User created in Appwrite:', newUser.$id);
    return newUser;
  } catch (error) {
    console.error('📣 Error creating user in Appwrite:', error);
    throw error;
  }
}

async function handleUserUpdated(data) {
  try {
    // Find the user by Clerk ID
    const existingUsers = await serverDatabases.listDocuments(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      [Query.equal('clerk_id', data.id)]
    );

    if (existingUsers.documents.length === 0) {
      console.log('User not found in Appwrite, creating instead:', data.id);
      return await handleUserCreated(data);
    }

    const existingUser = existingUsers.documents[0];

    // Update the user document
    const updatedUser = await serverDatabases.updateDocument(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      existingUser.$id,
      {
        email: data.email_addresses[0]?.email_address || existingUser.email,
        first_name: data.first_name || existingUser.first_name,
        last_name: data.last_name || existingUser.last_name,
        profile_image: data.image_url || existingUser.profile_image,
        phone_number:
          data.phone_numbers?.[0]?.phone_number || existingUser.phone_number,
        email_verified:
          Boolean(
            data.email_addresses?.[0]?.verification?.status === 'verified'
          ) ||
          Boolean(existingUser.email_verified) ||
          Boolean(false),
        updated_at: new Date().toISOString(),
      }
    );

    console.log('User updated in Appwrite:', updatedUser.$id);
  } catch (error) {
    console.error('Error updating user in Appwrite:', error);
    throw error;
  }
}

async function handleUserDeleted(data) {
  try {
    // Find the user by Clerk ID
    const existingUsers = await serverDatabases.listDocuments(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      [Query.equal('clerk_id', data.id)]
    );

    if (existingUsers.documents.length === 0) {
      console.log('User not found in Appwrite, nothing to delete:', data.id);
      return;
    }

    const existingUser = existingUsers.documents[0];

    // Mark the user as inactive instead of deleting
    const updatedUser = await serverDatabases.updateDocument(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      existingUser.$id,
      {
        is_active: Boolean(false),
        updated_at: new Date().toISOString(),
      }
    );

    console.log('User marked as inactive in Appwrite:', updatedUser.$id);
  } catch (error) {
    console.error('Error handling user deletion in Appwrite:', error);
    throw error;
  }
}
