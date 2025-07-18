// src/lib/appwrite-server.js
import { Client, Databases, Storage, ID, Query } from 'appwrite';

const serverClient = new Client();

serverClient
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY); // Only on server!

export const serverDatabases = new Databases(serverClient);
export const serverStorage = new Storage(serverClient);

export { ID, Query };
