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

    // Split SQL statements by semicolons and execute each one
    // MySQL2 doesn't support multiple statements in a single query by default
    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    for (const statement of statements) {
      if (statement.trim()) {
        await pool.query(statement);
      }
    }

    console.log('✓ Database migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('✗ Migration failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

runMigrations();
