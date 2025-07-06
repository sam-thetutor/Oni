import mongoose from 'mongoose';
import { config } from 'dotenv';
import { connectDB, disconnectDB } from '../db/connect.js';

config();

async function resetUserCollection() {
  try {
    console.log('🔄 Connecting to database...');
    await connectDB();
    
    const db = mongoose.connection.db;
    
    if (!db) {
      throw new Error('Database connection not established');
    }
    
    console.log('🗑️ Dropping existing User collection...');
    await db.dropCollection('users');
    console.log('✅ User collection dropped successfully');
    
    console.log('🔄 Disconnecting from database...');
    await disconnectDB();
    
    console.log('✅ Database reset completed successfully');
  } catch (error) {
    console.error('❌ Error resetting database:', error);
    process.exit(1);
  }
}

resetUserCollection(); 