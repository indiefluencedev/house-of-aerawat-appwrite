// For server environments we use the Node.js SDK
import { Client, Account, Databases, Storage, Users } from 'node-appwrite';

// Initialize the Appwrite client for server-side operations
const serverClient = new Client();

serverClient
  .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

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
export const FINE_JEWELLERY_COLLECTION_ID =
  process.env.APPWRITE_FINE_JEWELLERY_COLLECTION_ID;
export const STORAGE_BUCKET_ID = process.env.APPWRITE_STORAGE_BUCKET_ID;

// Export with consistent naming for server-side use
export {
  serverClient,
  account,
  databases as serverDatabases,
  storage as serverStorage,
  users,
};
