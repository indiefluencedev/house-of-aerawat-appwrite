// src/hooks/useUserSync.js
import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { UserService } from '@/services/userService';
import { useRouter } from 'next/navigation';

export const useUserSync = () => {
  const { user: clerkUser, isLoaded: isClerkLoaded } = useUser();
  const [appwriteUser, setAppwriteUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState('customer');
  const router = useRouter();

  // Define syncUserWithAppwrite using useCallback so it's memoized
  const syncUserWithAppwrite = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!clerkUser?.id) {
        console.warn('No clerk user ID available for sync');
        setIsLoading(false);
        return;
      }

      // Initialize user result variable
      let userResult = null;

      // Try to sync via the server API endpoint first (which has proper permissions)
      try {
        // Try our standard sync API
        const response = await fetch('/api/sync-user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userData: {
              clerkId: clerkUser.id,
              email: clerkUser.emailAddresses?.[0]?.emailAddress || '',
              firstName: clerkUser.firstName || '',
              lastName: clerkUser.lastName || '',
              profileImageUrl: clerkUser.imageUrl || null,
              phoneNumber: clerkUser.phoneNumbers?.[0]?.phoneNumber || null,
              role: 'customer', // Default role
              emailVerified:
                clerkUser.emailAddresses?.[0]?.verification?.status ===
                'verified',
            },
          }),
        });

        const result = await response.json();

        if (result.success) {
          console.log('User synced via standard API:', result.action);
          userResult = result.user;

          // Set user role based on the role field in Appwrite
          const currentUserRole = userResult.role || 'customer';
          setUserRole(currentUserRole);
          setAppwriteUser(userResult);

          // No need for client-side fallback since API sync worked
          return;
        } else {
          console.error('Failed to sync user via standard API:', result.error);
          throw new Error(result.error || 'Failed to sync user');
        }
      } catch (error) {
        console.error('API sync failed:', error.message);
        console.error(
          'User sync completely failed - this may indicate server issues'
        );

        // Don't attempt client-side fallback to avoid 401 errors
        // The user will need to be synced via webhook or manual retry
        setError('Failed to sync user data. Please try refreshing the page.');
        setAppwriteUser(null);
        setUserRole('customer');
        return;
      }

      // We'll handle redirects in the component that uses this hook
      // This prevents unwanted redirects during normal user operations
    } catch (err) {
      console.error('Error syncing user with Appwrite:', err);
      setError(err.message || 'Failed to sync user data');
    } finally {
      setIsLoading(false);
    }
  }, [clerkUser]);

  useEffect(() => {
    if (isClerkLoaded && clerkUser) {
      syncUserWithAppwrite();
    } else if (isClerkLoaded && !clerkUser) {
      setAppwriteUser(null);
      setUserRole('customer');
      setIsLoading(false);
    }
  }, [clerkUser, isClerkLoaded, syncUserWithAppwrite]);

  const updateAppwriteUser = async (updateData) => {
    try {
      setError(null);
      if (!appwriteUser) return null;

      const updatedUser = await UserService.updateUser(
        appwriteUser.$id,
        updateData
      );
      setAppwriteUser(updatedUser);
      setUserRole(updatedUser.role || 'customer');
      return updatedUser;
    } catch (err) {
      console.error('Error updating Appwrite user:', err);
      setError(err.message || 'Failed to update user');
      throw err;
    }
  };

  const refreshAppwriteUser = async () => {
    if (clerkUser) {
      await syncUserWithAppwrite();
    }
  };

  return {
    clerkUser,
    appwriteUser,
    userRole,
    isAdmin: userRole === 'admin', // Computed property for backward compatibility
    isLoading,
    error,
    updateAppwriteUser,
    refreshAppwriteUser,
  };
};
