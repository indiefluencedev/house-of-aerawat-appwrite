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

      // Try to sync via the server API endpoint first (which has proper permissions)
      try {
        // Try multiple approaches to sync the user
        let syncSuccessful = false;
        let userResult = null;

        // Try our standard sync API
        try {
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
              },
            }),
          });

          const result = await response.json();

          if (result.success) {
            console.log('User synced via standard API:', result.action);
            syncSuccessful = true;
            existingUser = result.user;
          } else {
            console.error(
              'Failed to sync user via standard API:',
              result.error
            );
            throw new Error(result.error || 'Failed to sync user');
          }
        } catch (standardApiError) {
          console.warn('Standard sync API failed:', standardApiError.message);
          // If standard API failed, trigger the client fallback
          throw new Error('Standard API sync failed');
        }
      } catch (apiError) {
        console.warn(
          'API sync failed, falling back to client method:',
          apiError.message
        );

        try {
          // Fallback to direct client method
          let existingUser = await UserService.getUserByClerkId(clerkUser.id);

          if (!existingUser) {
            // Create new user in Appwrite
            const userData = {
              clerkId: clerkUser.id,
              email: clerkUser.emailAddresses?.[0]?.emailAddress || '',
              firstName: clerkUser.firstName || '',
              lastName: clerkUser.lastName || '',
              profileImageUrl: clerkUser.imageUrl || null,
              phoneNumber: clerkUser.phoneNumbers?.[0]?.phoneNumber || null,
              role: 'customer', // Default role
            };

            existingUser = await UserService.createUser(userData);
          }

          // If we successfully got or created a user via client method
          if (existingUser) {
            console.log('User synced via client-side fallback');
            return existingUser;
          }
        } catch (clientError) {
          console.error('Client fallback also failed:', clientError.message);
          throw new Error('Failed to sync user data');
        }
      }

      // If we got an existingUser from either the API or fallback method
      if (existingUser) {
        try {
          // Update existing user with latest Clerk data
          const updateData = {
            email:
              clerkUser.emailAddresses?.[0]?.emailAddress || existingUser.email,
            first_name: clerkUser.firstName || existingUser.first_name,
            last_name: clerkUser.lastName || existingUser.last_name,
            profile_image: clerkUser.imageUrl || existingUser.profile_image,
            phone_number:
              clerkUser.phoneNumbers?.[0]?.phoneNumber ||
              existingUser.phone_number,
          };

          // Only update if there are changes
          const hasChanges = Object.keys(updateData).some(
            (key) => updateData[key] !== existingUser[key]
          );

          if (hasChanges) {
            existingUser = await UserService.updateUser(
              existingUser.$id,
              updateData
            );
          }
        } catch (updateError) {
          console.warn('Failed to update user data:', updateError.message);
          // Continue with existing user data, don't block the sync
        }
      }

      if (existingUser) {
        // Set user role based on the role field in Appwrite
        const currentUserRole = existingUser.role || 'customer';
        setUserRole(currentUserRole);
        setAppwriteUser(existingUser);
      } else {
        console.warn('No user data could be retrieved or created');
        setAppwriteUser(null);
        setUserRole('customer');
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
