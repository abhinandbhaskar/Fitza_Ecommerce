// utils/safeAccess.js
/**
 * Safely accesses nested object properties
 * @param {Object|null|undefined} obj - Target object
 * @param {string|Array} path - Dot path or array of keys
 * @param {*} [defaultValue=null] - Fallback value
 * @returns {*} Found value or defaultValue
 */
export const safe = (obj, path, defaultValue = null) => {
  // Immediate return for null/undefined input
  if (obj == null) return defaultValue;
  
  // Convert string path to array if needed
  const keys = Array.isArray(path) ? path : path.split('.');
  
  return keys.reduce((acc, key) => {
    // Handle array indices
    if (Array.isArray(acc) && !isNaN(key)) {
      const index = parseInt(key, 10);
      return index >= 0 && index < acc.length ? acc[index] : defaultValue;
    }
    
    // Handle regular objects
    if (acc && typeof acc === 'object' && key in acc) {
      return acc[key];
    }
    
    return defaultValue;
  }, obj);
};

// Optional helper for common use cases
export const safeNumber = (obj, path, defaultValue = 0) => {
  const value = safe(obj, path, defaultValue);
  return typeof value === 'number' ? value : defaultValue;
};

export const safeString = (obj, path, defaultValue = '') => {
  const value = safe(obj, path, defaultValue);
  return typeof value === 'string' ? value : defaultValue;
};