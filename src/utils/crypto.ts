// ============================================================================
// Secure Cryptographic Hashing Utilities (Web Crypto API)
// Ensures passwords are never stored in plain text under any environment.
// ============================================================================

const SALT = 'EduSync_Secure_Salt_2026_#X9';

/**
 * Computes a secure SHA-256 hash with salt for a given password.
 */
export async function hashPasswordClient(password: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(`${SALT}:${password}:${SALT}`);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Verifies a plain text password against a stored hash.
 */
export async function verifyPasswordClient(password: string, storedHash: string): Promise<boolean> {
  const computedHash = await hashPasswordClient(password);
  return computedHash === storedHash;
}

/**
 * Helper to calculate password strength metrics.
 */
export interface PasswordStrength {
  score: number; // 0 to 4
  label: 'Weak' | 'Fair' | 'Good' | 'Strong';
  hasMinLength: boolean;
  hasUpper: boolean;
  hasLower: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
}

export function evaluatePasswordStrength(password: string): PasswordStrength {
  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  let score = 0;
  if (hasMinLength) score++;
  if (hasUpper && hasLower) score++;
  if (hasNumber) score++;
  if (hasSpecial) score++;

  let label: 'Weak' | 'Fair' | 'Good' | 'Strong' = 'Weak';
  if (score === 2) label = 'Fair';
  else if (score === 3) label = 'Good';
  else if (score >= 4) label = 'Strong';

  return {
    score,
    label,
    hasMinLength,
    hasUpper,
    hasLower,
    hasNumber,
    hasSpecial
  };
}

