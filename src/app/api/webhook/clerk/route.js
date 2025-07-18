// src/app/api/webhooks/clerk/route.js
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { UserService } from '@/services/userService';

const userService = new UserService();

export async function POST(req) {
  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

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

  let evt;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    });
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occurred', {
      status: 400,
    });
  }

  // Handle the webhook
  const { id } = evt.data;
  const eventType = evt.type;

  console.log(`Webhook with an ID of ${id} and type of ${eventType}`);

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
    const userData = {
      clerk_id: data.id,
      email: data.email_addresses[0]?.email_address || '',
      first_name: data.first_name || '',
      last_name: data.last_name || '',
      full_name: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
      profile_image: data.image_url || '',
      phone: data.phone_numbers[0]?.phone_number || '',
      role: 'user',
      email_verified:
        data.email_addresses[0]?.verification?.status === 'verified',
    };

    const newUser = await userService.createUser(userData);
    console.log('User created in Appwrite:', newUser);
  } catch (error) {
    console.error('Error creating user in Appwrite:', error);
    throw error;
  }
}

async function handleUserUpdated(data) {
  try {
    const existingUser = await userService.getUserByClerkId(data.id);

    if (existingUser) {
      const updatedData = {
        email: data.email_addresses[0]?.email_address || '',
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        full_name: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
        profile_image: data.image_url || '',
        phone: data.phone_numbers[0]?.phone_number || '',
        email_verified:
          data.email_addresses[0]?.verification?.status === 'verified',
      };

      const updatedUser = await userService.updateUser(
        existingUser.$id,
        updatedData
      );
      console.log('User updated in Appwrite:', updatedUser);
    }
  } catch (error) {
    console.error('Error updating user in Appwrite:', error);
    throw error;
  }
}

async function handleUserDeleted(data) {
  try {
    const existingUser = await userService.getUserByClerkId(data.id);

    if (existingUser) {
      await userService.deleteUser(existingUser.$id);
      console.log('User deleted from Appwrite:', data.id);
    }
  } catch (error) {
    console.error('Error deleting user from Appwrite:', error);
    throw error;
  }
}
