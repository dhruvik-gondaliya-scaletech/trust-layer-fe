/**
 * Safely sets an item in localStorage.
 */
export function setStorageItem(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {}
}

/**
 * Safely gets an item from localStorage.
 */
export function getStorageItem(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

/**
 * Safely removes an item from localStorage.
 */
export function removeStorageItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {}
}

/**
 * Safely sets multiple items in localStorage (bulk write).
 */
export function setStorageItems(items: Record<string, string>): void {
  try {
    Object.entries(items).forEach(([key, value]) => {
      localStorage.setItem(key, value);
    });
  } catch {}
}

/**
 * Safely removes multiple items from localStorage (bulk delete).
 */
export function removeStorageItems(keys: string[]): void {
  try {
    keys.forEach((key) => {
      localStorage.removeItem(key);
    });
  } catch {}
}
