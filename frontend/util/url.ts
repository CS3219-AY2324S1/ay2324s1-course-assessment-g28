/**
 * Helper methods for url parsing.
 */

export function getFirstPartOfPath(path: string) {
  return "/" + path.split("/")[1];
}
