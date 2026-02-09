export const urlUUID = () => {
  const toEncode = crypto.randomUUID();
  const hex = toEncode.replace(/-/g, '');
  const buffer = Buffer.from(hex, 'hex');
  return buffer.toString('base64url');
};
