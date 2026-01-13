import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const poolConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  database: process.env.DB_NAME || 'abs_motor_group',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 20,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  // Add connection retry settings
  connectTimeout: 10000,
  // Enable multiple statements for migrations
  multipleStatements: true
};

const pool = mysql.createPool(poolConfig);

// Test connection with retry logic
const testConnection = async (retries = 5, delay = 2000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const connection = await pool.getConnection();
      console.log('Database connected successfully');
      connection.release();
      return true;
    } catch (err) {
      console.error(`Database connection attempt ${i + 1}/${retries} failed:`, err.message);
      if (i < retries - 1) {
        console.log(`Retrying in ${delay / 1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  console.error('Database connection failed after all retries');
  return false;
};

// Test initial connection (non-blocking to allow server to start)
testConnection().catch(err => {
  console.error('Initial database connection test failed:', err);
});

export default pool;
