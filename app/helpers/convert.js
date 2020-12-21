const UTF8toBase64 = (value) => {
  if (!value) throw new Error('value not defined');
  return Buffer.from(value, 'utf-8').toString('base64');
};

const Base64toUTF8 = (value) => {
  if (!value) throw new Error('value not defined');
  return Buffer.from(value, 'base64').toString('utf-8');
};

module.exports = {
  UTF8toBase64,
  Base64toUTF8,
};
