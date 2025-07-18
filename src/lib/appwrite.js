// src/lib/appwrite.js
import { Client, Databases, Storage, Account } from 'appwrite';

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT) // Your API Endpoint
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID); // Your project ID

export const databases = new Databases(client);
export const account = new Account(client);
export const storage = new Storage(client);

// Database and Collection IDs
export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
export const USERS_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID;

export { client };
