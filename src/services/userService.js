// src/services/userService.js
import { databases, DATABASE_ID, USERS_COLLECTION_ID } from '@/lib/appwrite';
import { ID } from 'appwrite';

export class UserService {
  // Create a new user in Appwrite
  async createUser(userData) {
    try {
      const user = await databases.createDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        ID.unique(),
        {
          clerk_id: userData.clerk_id,
          email: userData.email,
          first_name: userData.first_name || '',
          last_name: userData.last_name || '',
          full_name: userData.full_name || '',
          profile_image: userData.profile_image || '',
          phone: userData.phone || '',
          role: userData.role || 'user',
          email_verified: userData.email_verified || false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      );
      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Get user by Clerk ID
  async getUserByClerkId(clerkId) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        [
          {
            attribute: 'clerk_id',
            operator: 'equal',
            value: clerkId,
          },
        ]
      );

      return response.documents.length > 0 ? response.documents[0] : null;
    } catch (error) {
      console.error('Error fetching user by Clerk ID:', error);
      throw error;
    }
  }

  // Update user information
  async updateUser(documentId, userData) {
    try {
      const updatedUser = await databases.updateDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        documentId,
        {
          ...userData,
          updated_at: new Date().toISOString(),
        }
      );
      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // Delete user
  async deleteUser(documentId) {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        documentId
      );
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  // Get all users (admin only)
  async getAllUsers() {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        USERS_COLLECTION_ID
      );
      return response.documents;
    } catch (error) {
      console.error('Error fetching all users:', error);
      throw error;
    }
  }
}
