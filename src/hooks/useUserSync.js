// src/hooks/useUserSync.js
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { UserService } from '@/services/userService';

const userService = new UserService();

export const useUserSync = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const [appwriteUser, setAppwriteUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const syncUserToAppwrite = async (clerkUser) => {
    try {
      // Check if user already exists in Appwrite
      let existingUser = await userService.getUserByClerkId(clerkUser.id);

      if (existingUser) {
        // Update existing user with latest Clerk data
        const updatedData = {
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
          first_name: clerkUser.firstName || '',
          last_name: clerkUser.lastName || '',
          full_name: `${clerkUser.firstName || ''} ${
            clerkUser.lastName || ''
          }`.trim(),
          profile_image: clerkUser.imageUrl || '',
          email_verified:
            clerkUser.emailAddresses[0]?.verification?.status === 'verified',
        };

        existingUser = await userService.updateUser(
          existingUser.$id,
          updatedData
        );
        setAppwriteUser(existingUser);
      } else {
        // Create new user in Appwrite
        const newUserData = {
          clerk_id: clerkUser.id,
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
          first_name: clerkUser.firstName || '',
          last_name: clerkUser.lastName || '',
          full_name: `${clerkUser.firstName || ''} ${
            clerkUser.lastName || ''
          }`.trim(),
          profile_image: clerkUser.imageUrl || '',
          phone: clerkUser.phoneNumbers[0]?.phoneNumber || '',
          role: 'user',
          email_verified:
            clerkUser.emailAddresses[0]?.verification?.status === 'verified',
        };

        const newUser = await userService.createUser(newUserData);
        setAppwriteUser(newUser);
      }
    } catch (err) {
      console.error('Error syncing user to Appwrite:', err);
      setError(err.message);
    }
  };

  useEffect(() => {
    const syncUser = async () => {
      if (!isLoaded) return;

      setIsLoading(true);
      setError(null);

      if (isSignedIn && user) {
        await syncUserToAppwrite(user);
      } else {
        setAppwriteUser(null);
      }

      setIsLoading(false);
    };

    syncUser();
  }, [isLoaded, isSignedIn, user]);

  return {
    appwriteUser,
    clerkUser: user,
    isLoading,
    error,
    syncUserToAppwrite,
  };
};
