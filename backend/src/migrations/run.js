import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
  try {
    console.log('Starting database migrations...');

    // Read the SQL file
    const sqlFile = path.join(__dirname, '001_initial_schema.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');

    // Execute the migration
    await pool.query(sql);

    console.log('✓ Database migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('✗ Migration failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

runMigrations();
