import { generateEncryptionKey, exportEncryptionKey, importEncryptionKey, encryptData, decryptData } from './encryption';

interface SessionData {
  sessionKey: string;
  expiresAt: number;
}

// Generate a new session
export const createSession = async (): Promise<SessionData> => {
  const key = await generateEncryptionKey();
  const sessionKey = await exportEncryptionKey(key);
  
  // Session expires in 1 hour
  const expiresAt = Date.now() + 60 * 60 * 1000;
  
  const sessionData: SessionData = {
    sessionKey,
    expiresAt
  };
  
  // Store session data in memory only
  window.sessionStorage.setItem('sessionData', JSON.stringify(sessionData));
  
  return sessionData;
};

// Get current session
export const getSession = async (): Promise<{ key: CryptoKey; expiresAt: number } | null> => {
  const sessionDataStr = window.sessionStorage.getItem('sessionData');
  if (!sessionDataStr) return null;
  
  const sessionData: SessionData = JSON.parse(sessionDataStr);
  
  // Check if session has expired
  if (Date.now() > sessionData.expiresAt) {
    window.sessionStorage.removeItem('sessionData');
    return null;
  }
  
  const key = await importEncryptionKey(sessionData.sessionKey);
  return { key, expiresAt: sessionData.expiresAt };
};

// Encrypt sensitive data for a single transaction
export const encryptForTransaction = async (data: string): Promise<{ encryptedData: string; iv: string; sessionKey: string }> => {
  let session = await getSession();
  
  // Create new session if none exists or expired
  if (!session) {
    const newSession = await createSession();
    session = {
      key: await importEncryptionKey(newSession.sessionKey),
      expiresAt: newSession.expiresAt
    };
  }
  
  const { encryptedData, iv } = await encryptData(data, session.key);
  
  return {
    encryptedData,
    iv,
    sessionKey: await exportEncryptionKey(session.key)
  };
};

// Decrypt data from a transaction
export const decryptFromTransaction = async (
  encryptedData: string,
  iv: string,
  sessionKey: string
): Promise<string> => {
  const key = await importEncryptionKey(sessionKey);
  return await decryptData(encryptedData, iv, key);
}; 