import app from './app.js';
import config from './config/config.js';
import prisma from './config/database.js';
import fs from 'fs';

const PORT = config.port;

// Create uploads directory if it doesn't exist
const uploadsDir = '/tmp/uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Database connection check
async function checkDatabaseConnection() {
  const maxRetries = 10;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      await prisma.$connect();
      console.log('✓ Database connected successfully');
      return true;
    } catch (error) {
      retries++;
      console.log(`⚠ Database connection attempt ${retries}/${maxRetries} failed. Retrying in 5 seconds...`);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  console.error('✗ Failed to connect to database after maximum retries');
  return false;
}

// Start server
async function startServer() {
  try {
    // Check database connection
    const dbConnected = await checkDatabaseConnection();
    
    if (!dbConnected) {
      console.error('Cannot start server without database connection');
      process.exit(1);
    }

    // Start listening
    app.listen(PORT, '0.0.0.0', () => {
      console.log('=====================================');
      console.log('  ABS Motor Group API Server');
      console.log('=====================================');
      console.log(`Environment: ${config.nodeEnv}`);
      console.log(`Server running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
      console.log('=====================================');
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT signal received: closing HTTP server');
  await prisma.$disconnect();
  process.exit(0);
});

// Start the server
startServer();
