import { PrismaClient } from '@prisma/client'; // Standard named import

// Log the datasource URL Prisma is configured with
// NOTE: This might expose sensitive info in real logs, use cautiously.
const datasourceUrl = (PrismaClient as any)._baseDmmf?.datamodel?.datasources?.[0]?.url?.value;
console.log('[DEBUG] Prisma Datasource URL from config:', datasourceUrl);

// Remove the mock implementation entirely
/*
class PrismaClientMock {
  // ... mock implementation ...
}
*/

// Initialize db variable
let db: PrismaClient;

declare global {
  // eslint-disable-next-line no-var
  var __db: PrismaClient | undefined;
}

// Use the real PrismaClient in all environments for now
// This ensures we hit the actual database during development.
// The singleton pattern is still useful to avoid creating multiple connections.
if (!global.__db) {
  console.log('[DEBUG] Creating new PrismaClient instance...');
  try {
    global.__db = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
    });
    console.log('[DEBUG] PrismaClient instance created successfully.');
  } catch (e) {
    console.error('[DEBUG] FAILED TO CREATE PRISMA CLIENT INSTANCE:', e);
    throw e; // Re-throw the error to prevent the app from starting incorrectly
  }
}
db = global.__db;

export { db };
