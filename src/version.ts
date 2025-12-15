/**
 * Valor Registry Version Information
 * Update this file when releasing new versions
 */

export const VERSION = {
  number: '1.0.0',
  name: 'Foundation',
  releaseDate: '2024-12-15',
  buildDate: new Date().toISOString().split('T')[0]
};

export function getVersionString(): string {
  return `v${VERSION.number}`;
}

export function getFullVersionString(): string {
  return `v${VERSION.number} "${VERSION.name}"`;
}

export function getVersionWithDate(): string {
  return `v${VERSION.number} (Released ${VERSION.releaseDate})`;
}
