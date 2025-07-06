import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const KEY_LENGTH = 32;
const ITERATIONS = 100000;

export class EncryptionService {
  /**
   * Encrypt a private key
   */
  static encryptPrivateKey(privateKey: string, password: string): string {
    try {
      // Generate a random salt
      const salt = crypto.randomBytes(SALT_LENGTH);
      
      // Derive key from password using PBKDF2
      const key = crypto.pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, 'sha512');
      
      // Generate a random IV
      const iv = crypto.randomBytes(IV_LENGTH);
      
      // Create cipher
      const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
      cipher.setAAD(salt);
      
      // Encrypt the private key
      let encrypted = cipher.update(privateKey, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      // Get the auth tag
      const tag = cipher.getAuthTag();
      
      // Combine salt + iv + tag + encrypted data
      const result = salt.toString('hex') + ':' + iv.toString('hex') + ':' + tag.toString('hex') + ':' + encrypted;
      
      return result;
    } catch (error) {
      console.error('Error encrypting private key:', error);
      throw new Error('Failed to encrypt private key');
    }
  }

  /**
   * Decrypt a private key
   */
  static decryptPrivateKey(encryptedData: string, password: string): string {
    try {
      // Split the encrypted data
      const parts = encryptedData.split(':');
      if (parts.length !== 4) {
        throw new Error('Invalid encrypted data format');
      }
      
      const [saltHex, ivHex, tagHex, encrypted] = parts;
      
      // Convert hex strings back to buffers
      const salt = Buffer.from(saltHex, 'hex');
      const iv = Buffer.from(ivHex, 'hex');
      const tag = Buffer.from(tagHex, 'hex');
      
      // Derive key from password using PBKDF2
      const key = crypto.pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, 'sha512');
      
      // Create decipher
      const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
      decipher.setAAD(salt);
      decipher.setAuthTag(tag);
      
      // Decrypt the private key
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    } catch (error) {
      console.error('Error decrypting private key:', error);
      throw new Error('Failed to decrypt private key');
    }
  }

  /**
   * Check if a string is encrypted (not a bcrypt hash)
   */
  static isEncrypted(data: string): boolean {
    // Check if it's a bcrypt hash (starts with $2)
    if (data.startsWith('$2')) {
      return false; // This is a bcrypt hash, not our encryption
    }
    
    // Check if it's our encryption format (should have 4 parts separated by :)
    const parts = data.split(':');
    return parts.length === 4;
  }

  /**
   * Migrate bcrypt hash to encrypted format (for existing users)
   */
  static async migrateFromBcrypt(bcryptHash: string, password: string): Promise<string> {
    // For bcrypt hashes, we can't decrypt them, so we need to generate a new private key
    // This is a limitation - we can't recover the original private key from bcrypt
    throw new Error('Cannot migrate from bcrypt hash - private key is not recoverable');
  }
} 