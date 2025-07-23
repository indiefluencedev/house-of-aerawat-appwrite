// src/app/api/user/route.js
import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import {
  serverDatabases,
  DATABASE_ID,
  USERS_COLLECTION_ID,
} from '@/lib/appwrite-server';
import { Query } from 'node-appwrite';

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
      return NextResponse.json(
        {
          error: 'User not found',
          message: 'User needs to be synced first',
        },
        { status: 404 }
      );
    }

    const user = existingUsers.documents[0];
    console.log('✅ User found:', user.$id);

    return NextResponse.json({
      success: true,
      user,
      role: user.role || 'customer',
    });
  } catch (error) {
    console.error('❌ Error getting user:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
