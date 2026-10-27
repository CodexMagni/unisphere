import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn('⚠️ Warning: DATABASE_URL is not set in environment or .env file.');
}

export const sql = connectionString ? neon(connectionString) : null;

export async function query(text, params = [], retries = 3) {
  if (!sql) {
    throw new Error('DATABASE_URL is not configured. Please add your Neon connection string to the .env file.');
  }

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await sql.query(text, params || []);
    } catch (err) {
      const isTransient = err.message?.includes('fetch failed') ||
                          err.message?.includes('timeout') ||
                          err.sourceError?.code === 'UND_ERR_CONNECT_TIMEOUT';
      if (attempt < retries && isTransient) {
        await new Promise(res => setTimeout(res, 800 * (attempt + 1)));
        continue;
      }
      throw err;
    }
  }
}
