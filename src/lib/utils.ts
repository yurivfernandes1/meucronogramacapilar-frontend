export function hexToBase64(hex: string): string {
  if (!hex) return '';
  // Fallbacks for URLs or already base64 strings
  if (!hex.startsWith('\\x')) {
    if (/^[0-9a-fA-F]+$/.test(hex) && hex.length > 50) {
      // It's a raw hex string
    } else {
      return hex;
    }
  } else {
    hex = hex.slice(2);
  }

  try {
    // Try to use Buffer if available (Node.js fast path)
    if (typeof Buffer !== 'undefined') {
      return Buffer.from(hex, 'hex').toString('base64');
    }

    // Fallback for Edge/Browser: extremely fast manual parser
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let base64 = '';
    let i = 0;
    while (i + 5 < hex.length) {
      const num = parseInt(hex.substring(i, i + 6), 16);
      base64 += chars[(num >> 18) & 63] + chars[(num >> 12) & 63] + chars[(num >> 6) & 63] + chars[num & 63];
      i += 6;
    }
    if (i < hex.length) {
      const remaining = hex.substring(i);
      if (remaining.length === 2) {
        const num = parseInt(remaining, 16);
        base64 += chars[(num >> 2) & 63] + chars[(num & 3) << 4] + '==';
      } else if (remaining.length === 4) {
        const num = parseInt(remaining, 16);
        base64 += chars[(num >> 10) & 63] + chars[(num >> 4) & 63] + chars[(num & 15) << 2] + '=';
      }
    }
    return base64;
  } catch (e) {
    console.error('Failed to parse hex image:', e);
    return '';
  }
}
