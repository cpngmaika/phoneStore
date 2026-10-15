/**
 * Data validation helpers for client-side forms.
 */

// Phone number regex for Vietnamese mobile network operators (10 digits starting with 03, 05, 07, 08, 09)
const VIETNAMESE_PHONE_REGEX = /^0(3|5|7|8|9)[0-9]{8}$/;

// Standard RFC 5322 compatible email format regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

/**
 * Strips all non-digit characters and limits the input to 10 characters.
 */
export function cleanPhoneNumber(value: string): string {
  return value.replace(/\D/g, "").slice(0, 10);
}

/**
 * Validates Vietnamese mobile phone format (10 digits).
 */
export function isValidPhone(phone: string): boolean {
  if (!phone) return false;
  return VIETNAMESE_PHONE_REGEX.test(phone.trim());
}

/**
 * Validates email address syntax.
 */
export function isValidEmail(email: string): boolean {
  if (!email) return false;
  return EMAIL_REGEX.test(email.trim());
}

/**
 * Validates full name has at least 2 characters.
 */
export function isValidFullName(name: string): boolean {
  if (!name) return false;
  return name.trim().length >= 2;
}

/**
 * Validates password has at least 8 non-whitespace characters.
 */
export function isValidPassword(password: string): boolean {
  if (!password) return false;
  return password.trim().length >= 8;
}

/**
 * Validates URL format starting with http:// or https://.
 */
export function isValidUrl(url: string): boolean {
  if (!url || !url.trim()) return true;
  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}
