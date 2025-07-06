import { config } from 'dotenv';
import crypto from 'crypto';

config();

// Decrypt data using the session key
export async function decryptForTransaction(
  encryptedData: string,
  iv: string,
  sessionKey: string
): Promise<string> {
  try {
    // Convert base64 strings to buffers
    const encryptedBuffer = Buffer.from(encryptedData, 'base64');
    const ivBuffer = Buffer.from(iv, 'base64');
    const keyBuffer = Buffer.from(sessionKey, 'base64');

    // Extract the auth tag (last 16 bytes) and ciphertext
    const authTag = encryptedBuffer.slice(-16);
    const ciphertext = encryptedBuffer.slice(0, -16);

    // Create decipher
    const decipher = crypto.createDecipheriv('aes-256-gcm', keyBuffer, ivBuffer);
    decipher.setAuthTag(authTag);

    // Decrypt the data
    const decrypted = Buffer.concat([
      decipher.update(ciphertext),
      decipher.final()
    ]);

    return decrypted.toString('utf8');
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
} 