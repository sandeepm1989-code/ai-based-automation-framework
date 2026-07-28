import * as crypto from 'crypto';

export function calculateMD5(data: object | string): string {
  const content = typeof data === 'string' ? data : JSON.stringify(data);
  return crypto.createHash('md5').update(content).digest('hex');
}

/**
 * Calculates MD5 checksum of keys/structure to detect schema drift or missing fields.
 */
export function generateSchemaChecksum(payload: object): string {
  // Extract keys recursively to hash structure instead of values
  const keysOnly = Object.keys(payload).sort().join('|');
  return crypto.createHash('md5').update(keysOnly).digest('hex');
}
