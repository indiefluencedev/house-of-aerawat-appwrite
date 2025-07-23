// src/app/api/sync-user/route.js
import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import {
  serverDatabases,
  DATABASE_ID,
  USERS_COLLECTION_ID,
} from '@/lib/appwrite-server';
import { ID, Query } from 'node-appwrite';

export async function POST(request) {
  try {
    console.log('🔄 Starting user sync process...');

    // Get Clerk auth
    const { userId } = getAuth(request);
    console.log('👤 Clerk userId:', userId);

    if (!userId) {
      console.log('❌ No Clerk userId found');
      return NextResponse.json(
        { error: 'Unauthorized - No Clerk user ID' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { userData } = body;
    console.log('📝 Received userData:', JSON.stringify(userData, null, 2));

    if (!userData || !userData.clerkId) {
      console.log('❌ Invalid user data received');
      return NextResponse.json(
        { error: 'Invalid user data - missing clerkId' },
        { status: 400 }
      );
    }

    // Verify the Clerk user ID matches the userData
    if (userData.clerkId !== userId) {
      console.log('❌ Clerk ID mismatch:', {
        received: userData.clerkId,
        expected: userId,
      });
      return NextResponse.json({ error: 'User ID mismatch' }, { status: 403 });
    }

    console.log('🔍 Checking if user exists in Appwrite...');
    console.log('📊 Database ID:', DATABASE_ID);
    console.log('📁 Collection ID:', USERS_COLLECTION_ID);

    // Check if user exists in Appwrite with retry mechanism for race conditions
    let existingUser = null;
    let retryCount = 0;
    const maxRetries = 3;

    while (retryCount < maxRetries) {
      const existingUsers = await serverDatabases.listDocuments(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        [Query.equal('clerk_id', userData.clerkId)]
      );

      console.log('📋 Found existing users:', existingUsers.documents.length);

      if (existingUsers.documents.length > 0) {
        existingUser = existingUsers.documents[0];
        break;
      }

      // Small delay to handle race conditions
      if (retryCount < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        retryCount++;
        console.log(
          `🔄 Retry ${retryCount}/${maxRetries} - checking for existing user...`
        );
      } else {
        break;
      }
    }

    if (!existingUser) {
      console.log('➕ Creating new user in Appwrite...');

      // Detect if user signed up via Google OAuth
      const isGoogleUser =
        userData.email &&
        (userData.profileImageUrl?.includes('googleusercontent.com') ||
          userData.emailVerified === true); // Google users typically have verified emails from Clerk

      console.log('🔍 Detecting sign-up method:', {
        isGoogleUser,
        profileImageUrl: userData.profileImageUrl,
        emailVerified: userData.emailVerified,
      });

      const newUserData = {
        clerk_id: userData.clerkId,
        email: userData.email,
        first_name: userData.firstName || '',
        last_name: userData.lastName || '',
        profile_image: userData.profileImageUrl || '',
        phone_number: userData.phoneNumber || '',
        role: userData.role || 'customer',
        is_active: Boolean(true),
        // Set email_verified to true for Google users, otherwise use Clerk's verification status
        email_verified: Boolean(
          isGoogleUser || userData.emailVerified || false
        ),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      console.log(
        '📝 New user data to create:',
        JSON.stringify(newUserData, null, 2)
      );

      // Double-check for race condition before creating
      const finalCheck = await serverDatabases.listDocuments(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        [Query.equal('clerk_id', userData.clerkId)]
      );

      if (finalCheck.documents.length > 0) {
        console.log(
          '⚠️ User was created by another process, using existing user'
        );
        existingUser = finalCheck.documents[0];

        return NextResponse.json({
          success: true,
          user: existingUser,
          action: 'found_existing',
        });
      }

      // Create new user in Appwrite
      const newUser = await serverDatabases.createDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        ID.unique(),
        newUserData
      );

      console.log('✅ User created successfully:', newUser.$id);

      return NextResponse.json({
        success: true,
        user: newUser,
        action: 'created',
      });
    } else {
      console.log('🔄 Updating existing user...');

      // Update existing user
      const updateData = {
        email: userData.email || existingUser.email,
        first_name: userData.firstName || existingUser.first_name,
        last_name: userData.lastName || existingUser.last_name,
        profile_image: userData.profileImageUrl || existingUser.profile_image,
        phone_number: userData.phoneNumber || existingUser.phone_number,
        email_verified:
          userData.emailVerified !== undefined
            ? Boolean(userData.emailVerified)
            : Boolean(existingUser.email_verified),
        updated_at: new Date().toISOString(),
      };

      console.log('📝 Update data:', JSON.stringify(updateData, null, 2));

      // Only update if there are changes
      const hasChanges = Object.keys(updateData).some(
        (key) => key !== 'updated_at' && updateData[key] !== existingUser[key]
      );

      if (hasChanges) {
        const updatedUser = await serverDatabases.updateDocument(
          DATABASE_ID,
          USERS_COLLECTION_ID,
          existingUser.$id,
          updateData
        );

        console.log('✅ User updated successfully:', updatedUser.$id);

        return NextResponse.json({
          success: true,
          user: updatedUser,
          action: 'updated',
        });
      }

      console.log('ℹ️ No changes detected, skipping update');

      return NextResponse.json({
        success: true,
        user: existingUser,
        action: 'no_changes',
      });
    }
  } catch (error) {
    console.error('❌ Error syncing user:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      type: error.type,
      stack: error.stack,
    });

    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error.message,
        code: error.code || 'UNKNOWN_ERROR',
      },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('🔍 Getting user by Clerk ID:', userId);

    const existingUsers = await serverDatabases.listDocuments(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      [Query.equal('clerk_id', userId)]
    );

    if (existingUsers.documents.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = existingUsers.documents[0];
    console.log('✅ User found:', user.$id);

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('❌ Error getting user:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
