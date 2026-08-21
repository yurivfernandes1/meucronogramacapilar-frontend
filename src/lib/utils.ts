export function hexToBase64(hexString: string): string {
  if (!hexString) return '';
  let str = hexString;
  if (str.startsWith('\\x')) {
    str = str.substring(2);
  }
  const bytes = new Uint8Array(Math.ceil(str.length / 2));
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(str.substr(i * 2, 2), 16);
  }
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return typeof window === 'undefined' ? Buffer.from(bytes).toString('base64') : window.btoa(binary);
}
