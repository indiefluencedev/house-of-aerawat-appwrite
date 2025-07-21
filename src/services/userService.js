// src/services/userService.js
import {
  databases,
  DATABASE_ID,
  USERS_COLLECTION_ID,
} from '@/lib/appwrite-client';
import {
  serverDatabases,
  DATABASE_ID as SERVER_DATABASE_ID,
  USERS_COLLECTION_ID as SERVER_USERS_COLLECTION_ID,
} from '@/lib/appwrite-server';
import { ID, Query } from 'node-appwrite';

export class UserService {
  // Create user in Appwrite database
  static async createUser(userData) {
    try {
      const user = await databases.createDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        ID.unique(),
        {
          clerk_id: userData.clerkId,
          email: userData.email,
          first_name: userData.firstName,
          last_name: userData.lastName,
          profile_image: userData.profileImageUrl || null,
          phone_number: userData.phoneNumber || null,
          role: userData.role || 'customer',
          is_active: Boolean(true),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          // Add any other fields you need
        }
      );
      return user;
    } catch (error) {
      console.error('Error creating user in Appwrite:', error);
      throw error;
    }
  }

  // Get user by Clerk ID
  static async getUserByClerkId(clerkId) {
    try {
      const users = await databases.listDocuments(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        [Query.equal('clerk_id', clerkId)]
      );
      return users.documents.length > 0 ? users.documents[0] : null;
    } catch (error) {
      console.error('Error getting user by Clerk ID:', error);
      throw error;
    }
  }

  // Update user in Appwrite database
  static async updateUser(userId, updateData) {
    try {
      const user = await databases.updateDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        userId,
        {
          ...updateData,
          updated_at: new Date().toISOString(),
        }
      );
      return user;
    } catch (error) {
      console.error('Error updating user in Appwrite:', error);
      throw error;
    }
  }

  // Delete user from Appwrite database
  static async deleteUser(userId) {
    try {
      await databases.deleteDocument(DATABASE_ID, USERS_COLLECTION_ID, userId);
      return true;
    } catch (error) {
      console.error('Error deleting user from Appwrite:', error);
      throw error;
    }
  }

  // Get all users with pagination
  static async getAllUsers(limit = 20, offset = 0) {
    try {
      const users = await databases.listDocuments(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        [Query.limit(limit), Query.offset(offset), Query.orderDesc('createdAt')]
      );
      return users.documents;
    } catch (error) {
      console.error('Error getting all users:', error);
      throw error;
    }
  }

  // Set or unset admin status for a user
  static async setUserRole(userId, role) {
    try {
      const user = await databases.updateDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        userId,
        {
          role: role,
          updated_at: new Date().toISOString(),
        }
      );
      return user;
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  }

  // Server-side functions (for API routes)
  static async createUserServer(userData) {
    try {
      const user = await serverDatabases.createDocument(
        SERVER_DATABASE_ID,
        SERVER_USERS_COLLECTION_ID,
        ID.unique(),
        {
          clerk_id: userData.clerkId,
          email: userData.email,
          first_name: userData.firstName || '',
          last_name: userData.lastName || '',
          profile_image: userData.profileImageUrl || null,
          phone_number: userData.phoneNumber || null,
          role: userData.role || 'customer',
          is_active: Boolean(true),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      );
      return user;
    } catch (error) {
      console.error('Error creating user in Appwrite (server):', error);
      throw error;
    }
  }

  static async getUserByClerkIdServer(clerkId) {
    try {
      // Try server databases first
      try {
        const users = await serverDatabases.listDocuments(
          SERVER_DATABASE_ID,
          SERVER_USERS_COLLECTION_ID,
          [Query.equal('clerk_id', clerkId)]
        );
        return users.documents.length > 0 ? users.documents[0] : null;
      } catch (serverError) {
        // If server request fails (e.g. in Edge Runtime), fall back to client-side databases
        console.warn(
          'Server database access failed, falling back to client database:',
          serverError.message
        );
        return await this.getUserByClerkId(clerkId);
      }
    } catch (error) {
      console.error('Error getting user by Clerk ID (server):', error);
      throw error;
    }
  }

  static async updateUserServer(userId, updateData) {
    try {
      const user = await serverDatabases.updateDocument(
        SERVER_DATABASE_ID,
        SERVER_USERS_COLLECTION_ID,
        userId,
        {
          ...updateData,
          updated_at: new Date().toISOString(),
        }
      );
      return user;
    } catch (error) {
      console.error('Error updating user in Appwrite (server):', error);
      throw error;
    }
  }
}
