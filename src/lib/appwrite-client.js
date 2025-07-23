// src/lib/appwrite-client.js
import { Client, Account, Databases, Storage, Functions } from 'appwrite';

// Validate required environment variables for client-side
const requiredClientEnvVars = {
  NEXT_PUBLIC_APPWRITE_ENDPOINT: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
  NEXT_PUBLIC_APPWRITE_PROJECT_ID: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
  NEXT_PUBLIC_APPWRITE_DATABASE_ID:
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
  NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID:
    process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID,
};

// Check for missing client environment variables only in production
const missingClientEnvVars = Object.entries(requiredClientEnvVars)
  .filter(([key, value]) => !value)
  .map(([key]) => key);

if (missingClientEnvVars.length > 0 && process.env.NODE_ENV === 'production') {
  console.error(
    '❌ Missing required client environment variables:',
    missingClientEnvVars
  );
  missingClientEnvVars.forEach((varName) => {
    console.error(`❌ ${varName} environment variable is missing`);
  });
}

// Client-side configuration
const client = new Client();

// Only configure if we have the required environment variables
if (
  process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT &&
  process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID
) {
  client
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);
}

// Client-side services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const functions = new Functions(client);

// Database and collection IDs
export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
export const USERS_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID;
export const ORDERS_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID;
export const PRODUCTS_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID;
export const FINE_JEWELLERY_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_FINE_JEWELLERY_COLLECTION_ID;
export const STORAGE_BUCKET_ID = process.env.NEXT_PUBLIC_STORAGE_BUCKET_ID;

export { client };
