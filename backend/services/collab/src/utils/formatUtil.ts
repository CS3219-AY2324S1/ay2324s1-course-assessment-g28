export function toBase64(str: string): string {
  return btoa(str);
}

export function fromBase64(base64: string): string {
  return atob(base64);
}