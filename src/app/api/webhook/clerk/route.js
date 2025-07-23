// src/app/api/webhook/clerk/route.js
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import {
  serverDatabases,
  DATABASE_ID,
  USERS_COLLECTION_ID,
} from '@/lib/appwrite-server';
import { ID, Query } from 'node-appwrite';

// Force Node.js runtime for this API route to support Appwrite SDK fully
export const runtime = 'nodejs';

// GET endpoint for testing webhook connectivity
export async function GET() {
  return new Response(
    JSON.stringify({
      status: 'ok',
      message: 'Clerk webhook endpoint is active',
      timestamp: new Date().toISOString(),
      environment: {
        hasWebhookSecret: !!process.env.CLERK_WEBHOOK_SECRET,
        hasDatabaseId: !!DATABASE_ID,
        hasUsersCollectionId: !!USERS_COLLECTION_ID,
      },
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

export async function POST(req) {
  const startTime = Date.now();
  console.log('📣 Clerk webhook received at:', new Date().toISOString());

  try {
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
      console.error('📣 Missing required svix headers');
      return new Response('Error occurred -- no svix headers', {
        status: 400,
      });
    }

    // Get the body
    const payload = await req.json();
    const body = JSON.stringify(payload);

    console.log('📣 Webhook payload size:', body.length, 'bytes');

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
      console.error('📣 Error verifying webhook:', err.message);
      return new Response('Error occurred - webhook verification failed', {
        status: 400,
      });
    }

    // Handle the webhook
    const { id } = evt.data;
    const eventType = evt.type;

    console.log(`📣 Webhook with an ID of ${id} and type of ${eventType}`);
    console.log(`📣 Event data keys:`, Object.keys(evt.data));

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
          return new Response(`Unhandled event type: ${eventType}`, {
            status: 200,
          });
      }

      const processingTime = Date.now() - startTime;
      console.log(
        `📣 Successfully processed ${eventType} webhook for user ${id} in ${processingTime}ms`
      );
      return new Response('Success', { status: 200 });
    } catch (error) {
      const processingTime = Date.now() - startTime;
      console.error(
        `📣 Error handling webhook ${eventType} after ${processingTime}ms:`,
        error
      );
      console.error('📣 Error details:', error.message, error.stack);
      return new Response(`Error processing webhook: ${error.message}`, {
        status: 500,
      });
    }
  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error(
      `📣 Unexpected error in webhook handler after ${processingTime}ms:`,
      error
    );
    return new Response(`Unexpected error: ${error.message}`, {
      status: 500,
    });
  }
}

async function handleUserCreated(data) {
  try {
    console.log('📣 Processing user.created webhook for:', data.id);

    // Validate required data
    if (!data.id) {
      throw new Error('Missing required field: id');
    }

    if (!data.email_addresses || data.email_addresses.length === 0) {
      throw new Error('Missing required field: email_addresses');
    }

    const primaryEmail = data.email_addresses[0]?.email_address;
    if (!primaryEmail) {
      throw new Error('Missing primary email address');
    }

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
      return existingUsers.documents[0];
    }

    console.log('📣 Creating new user in Appwrite:', {
      clerkId: data.id,
      email: primaryEmail,
      firstName: data.first_name || '',
      lastName: data.last_name || '',
    });

    // Detect if user signed up via Google OAuth
    const isGoogleUser =
      data.image_url?.includes('googleusercontent.com') ||
      data.external_accounts?.some(
        (account) => account.provider === 'oauth_google'
      );

    console.log('📣 Detecting sign-up method:', {
      isGoogleUser,
      imageUrl: data.image_url,
      externalAccounts: data.external_accounts?.map((acc) => acc.provider),
    });

    // Create new user document with proper data validation
    const userData = {
      clerk_id: data.id,
      email: primaryEmail,
      first_name: data.first_name || '',
      last_name: data.last_name || '',
      profile_image: data.image_url || '',
      phone_number: data.phone_numbers?.[0]?.phone_number || '',
      role: 'customer',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      // Set email_verified to true for Google users, otherwise check Clerk's verification
      email_verified:
        isGoogleUser ||
        data.email_addresses?.[0]?.verification?.status === 'verified' ||
        false,
    };

    console.log('📣 User data to create:', userData);

    const newUser = await serverDatabases.createDocument(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      ID.unique(),
      userData
    );

    console.log('📣 User created successfully in Appwrite:', newUser.$id);
    return newUser;
  } catch (error) {
    console.error('📣 Error creating user in Appwrite:', error);
    console.error('📣 Error details:', error.message);
    console.error('📣 User data received:', JSON.stringify(data, null, 2));
    throw new Error(`Failed to create user: ${error.message}`);
  }
}

async function handleUserUpdated(data) {
  try {
    console.log('📣 Processing user.updated webhook for:', data.id);

    // Validate required data
    if (!data.id) {
      throw new Error('Missing required field: id');
    }

    // Find the user by Clerk ID
    const existingUsers = await serverDatabases.listDocuments(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      [Query.equal('clerk_id', data.id)]
    );

    if (existingUsers.documents.length === 0) {
      console.log('📣 User not found in Appwrite, creating instead:', data.id);
      return await handleUserCreated(data);
    }

    const existingUser = existingUsers.documents[0];
    console.log('📣 Updating existing user in Appwrite:', existingUser.$id);

    // Prepare update data
    const updateData = {
      updated_at: new Date().toISOString(),
    };

    // Only update fields that are provided and different
    if (
      data.email_addresses?.[0]?.email_address &&
      data.email_addresses[0].email_address !== existingUser.email
    ) {
      updateData.email = data.email_addresses[0].email_address;
    }

    if (
      data.first_name !== undefined &&
      data.first_name !== existingUser.first_name
    ) {
      updateData.first_name = data.first_name || '';
    }

    if (
      data.last_name !== undefined &&
      data.last_name !== existingUser.last_name
    ) {
      updateData.last_name = data.last_name || '';
    }

    if (
      data.image_url !== undefined &&
      data.image_url !== existingUser.profile_image
    ) {
      updateData.profile_image = data.image_url || '';
    }

    if (
      data.phone_numbers?.[0]?.phone_number &&
      data.phone_numbers[0].phone_number !== existingUser.phone_number
    ) {
      updateData.phone_number = data.phone_numbers[0].phone_number;
    }

    // Update email verification status
    const isVerified =
      data.email_addresses?.[0]?.verification?.status === 'verified';
    if (
      isVerified !== undefined &&
      isVerified !== existingUser.email_verified
    ) {
      updateData.email_verified = isVerified;
    }

    console.log('📣 Update data:', updateData);

    // Only update if there are actual changes
    if (Object.keys(updateData).length > 1) {
      // More than just updated_at
      const updatedUser = await serverDatabases.updateDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        existingUser.$id,
        updateData
      );

      console.log('📣 User updated successfully in Appwrite:', updatedUser.$id);
      return updatedUser;
    } else {
      console.log('📣 No changes detected, skipping update for user:', data.id);
      return existingUser;
    }
  } catch (error) {
    console.error('📣 Error updating user in Appwrite:', error);
    console.error('📣 Error details:', error.message);
    console.error('📣 User data received:', JSON.stringify(data, null, 2));
    throw new Error(`Failed to update user: ${error.message}`);
  }
}

async function handleUserDeleted(data) {
  try {
    console.log('📣 Processing user.deleted webhook for:', data.id);

    // Validate required data
    if (!data.id) {
      throw new Error('Missing required field: id');
    }

    // Find the user by Clerk ID
    const existingUsers = await serverDatabases.listDocuments(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      [Query.equal('clerk_id', data.id)]
    );

    if (existingUsers.documents.length === 0) {
      console.log('📣 User not found in Appwrite, nothing to delete:', data.id);
      return null;
    }

    const existingUser = existingUsers.documents[0];
    console.log('📣 Marking user as inactive in Appwrite:', existingUser.$id);

    // Mark the user as inactive instead of deleting
    const updatedUser = await serverDatabases.updateDocument(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      existingUser.$id,
      {
        is_active: false,
        updated_at: new Date().toISOString(),
      }
    );

    console.log(
      '📣 User marked as inactive successfully in Appwrite:',
      updatedUser.$id
    );
    return updatedUser;
  } catch (error) {
    console.error('📣 Error handling user deletion in Appwrite:', error);
    console.error('📣 Error details:', error.message);
    console.error('📣 User data received:', JSON.stringify(data, null, 2));
    throw new Error(`Failed to delete user: ${error.message}`);
  }
}
