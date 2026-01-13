import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
  let connection;
  try {
    console.log('Starting database migrations...');

    // Get a connection from the pool
    connection = await pool.getConnection();

    // Read the SQL file
    const sqlFile = path.join(__dirname, '001_initial_schema.sql');
    let sql = fs.readFileSync(sqlFile, 'utf8');

    // Remove SQL comments (both -- and /* */ style)
    sql = sql.replace(/--.*$/gm, ''); // Remove single-line comments
    sql = sql.replace(/\/\*[\s\S]*?\*\//g, ''); // Remove multi-line comments

    // Split SQL statements by semicolons and execute each one
    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await connection.query(statement);
        } catch (error) {
          // If it's a "duplicate" or "already exists" error, we can continue
          if (error.code === 'ER_DUP_KEYNAME' || error.code === 'ER_TABLE_EXISTS_ERROR') {
            console.log(`Skipping: ${error.message}`);
            continue;
          }
          throw error;
        }
      }
    }

    console.log('✓ Database migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('✗ Migration failed:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

runMigrations();
