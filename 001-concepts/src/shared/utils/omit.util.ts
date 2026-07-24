// src/shared/utils/omit.util.ts

/**
 * Omit properties from an object based on the provided keys.
 * @param obj - The object from which properties will be omitted.
 * @param keys - An array of keys to be omitted from the object.
 * @returns A new object with the specified keys omitted.
 */
export function omit<T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const clone = { ...obj };

  for (const key of keys) {
    delete clone[key];
  }

  return clone;
}
