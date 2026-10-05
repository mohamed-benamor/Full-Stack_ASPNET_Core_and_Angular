const toCamel = (s: string) => s.replace(/[-_]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""));

const toKebab = (s: string) => s.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

export function transformKeys(value: unknown, fn: (k: string) => string): unknown {
  if (Array.isArray(value)) {
    return value.map(v => transformKeys(v, fn));
  }
  if (value !== null && typeof value === "object" && value.constructor === Object) {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [fn(k), transformKeys(v, fn)]));
  }
  return value;
}

export const keysToCamel = (v: unknown) => transformKeys(v, toCamel);
export const keysToKebab = (v: unknown) => transformKeys(v, toKebab);
