// src/db/index.ts
import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// initialize a neon client 
const sql = neon(process.env.DATABASE_URL!);

export const db = drizzle({ client: sql });
