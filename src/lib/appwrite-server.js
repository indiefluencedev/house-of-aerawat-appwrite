// For server environments we use the Node.js SDK
import { Client, Account, Databases, Storage, Users } from 'node-appwrite';

// Initialize the Appwrite client for server-side operations
const serverClient = new Client();

serverClient
  .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

// Verify server-side configuration
if (!process.env.APPWRITE_ENDPOINT) {
  console.error('❌ APPWRITE_ENDPOINT environment variable is missing');
}

if (!process.env.APPWRITE_PROJECT_ID) {
  console.error('❌ APPWRITE_PROJECT_ID environment variable is missing');
}

if (!process.env.APPWRITE_DATABASE_ID) {
  console.error('❌ APPWRITE_DATABASE_ID environment variable is missing');
}

if (!process.env.APPWRITE_USERS_COLLECTION_ID) {
  console.error(
    '❌ APPWRITE_USERS_COLLECTION_ID environment variable is missing'
  );
}

if (!process.env.APPWRITE_API_KEY) {
  console.error('❌ APPWRITE_API_KEY environment variable is missing');
} else {
  console.log('✅ Appwrite server client configured with API key');
}

// Verify that project ID is set (this was causing your original error)
if (!process.env.APPWRITE_PROJECT_ID) {
  console.error(
    '❌ CRITICAL: APPWRITE_PROJECT_ID is missing - this will cause authentication failures'
  );
} else {
  console.log(
    '✅ Appwrite project ID configured:',
    process.env.APPWRITE_PROJECT_ID
  );
}

// Initialize services
const account = new Account(serverClient);
const databases = new Databases(serverClient);
const storage = new Storage(serverClient);
const users = new Users(serverClient);

// Database and collection IDs - use server-side environment variables
export const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;
export const USERS_COLLECTION_ID = process.env.APPWRITE_USERS_COLLECTION_ID;
export const ORDERS_COLLECTION_ID = process.env.APPWRITE_ORDERS_COLLECTION_ID;
export const PRODUCTS_COLLECTION_ID =
  process.env.APPWRITE_PRODUCTS_COLLECTION_ID;

// Export with the renamed databases variable for server-side use
export { serverClient, account, databases as serverDatabases, storage, users };
