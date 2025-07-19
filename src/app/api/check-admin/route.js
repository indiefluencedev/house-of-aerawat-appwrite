// src/app/api/check-admin/route.js
import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { UserService } from '@/services/userService';
import {
  serverDatabases,
  DATABASE_ID,
  USERS_COLLECTION_ID,
} from '@/lib/appwrite-server';
import { Query } from 'node-appwrite';

// Force Node.js runtime for this API route to support Appwrite SDK fully
export const runtime = 'nodejs';

export async function GET(request) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Try to use the UserService first (which will use the client-side databases)
    // If that fails due to authentication issues, fall back to direct access
    try {
      const user = await UserService.getUserByClerkIdServer(userId);
      if (user) {
        const isAdmin = user.is_Admin === true;
        return NextResponse.json({
          success: true,
          isAdmin,
          user: {
            $id: user.$id,
            clerkId: user.clerkId,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            is_Admin: user.is_Admin,
            role: user.role,
          },
        });
      }
    } catch (serviceError) {
      console.warn(
        'Failed to use UserService, falling back to direct database access:',
        serviceError.message
      );
    }

    // Direct database access as fallback
    const users = await serverDatabases.listDocuments(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      [Query.equal('clerk_id', userId)]
    );

    const user = users.documents.length > 0 ? users.documents[0] : null;

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const isAdmin = user.is_Admin === true;

    return NextResponse.json({
      success: true,
      isAdmin,
      user: {
        $id: user.$id,
        clerk_id: user.clerk_id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        is_Admin: user.is_Admin,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Error checking admin status:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
