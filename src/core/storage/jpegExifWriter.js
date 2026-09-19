export function injectJpegExifTags(buffer, tags = []) {
  if (!tags.length) return buffer;
  const bytes = new Uint8Array(buffer);
  if (bytes[0] !== 0xff || bytes[1] !== 0xd8) return buffer;

  const tagStr = tags.join('; ');
  const utf16 = [];
  for (let i = 0; i < tagStr.length; i++) {
    const c = tagStr.charCodeAt(i);
    utf16.push(c & 0xff, (c >> 8) & 0xff);
  }
  utf16.push(0, 0);

  const ifd0TagCount = 1;
  const tagLen = utf16.length;
  const ifd0Size = 2 + ifd0TagCount * 12 + 4 + tagLen;
  const tiffHeaderSize = 8;
  const exifHeaderSize = 6;
  const app1PayloadSize = exifHeaderSize + tiffHeaderSize + ifd0Size;
  const app1TotalSize = 2 + 2 + app1PayloadSize;

  const app1 = new Uint8Array(app1TotalSize);
  let p = 0;
  app1[p++] = 0xff; app1[p++] = 0xe1; // APP1 marker
  const len = app1PayloadSize + 2;
  app1[p++] = (len >> 8) & 0xff; app1[p++] = len & 0xff; // length

  // 'Exif\0\0'
  const exifSig = [0x45, 0x78, 0x69, 0x66, 0x00, 0x00];
  for (let i = 0; i < exifSig.length; i++) app1[p++] = exifSig[i];

  const tiffStart = p;
  app1[p++] = 0x49; app1[p++] = 0x49; // 'II' Little Endian
  app1[p++] = 0x2a; app1[p++] = 0x00; // 42
  app1[p++] = 0x08; app1[p++] = 0x00; app1[p++] = 0x00; app1[p++] = 0x00; // IFD0 offset

  app1[p++] = 0x01; app1[p++] = 0x00; // 1 entry

  // Tag 0x9C9E (XPKeywords), Type 1 (BYTE)
  app1[p++] = 0x9e; app1[p++] = 0x9c;
  app1[p++] = 0x01; app1[p++] = 0x00;
  app1[p++] = tagLen & 0xff; app1[p++] = (tagLen >> 8) & 0xff;
  app1[p++] = 0x00; app1[p++] = 0x00;

  const tagOffset = tiffHeaderSize + 2 + 12 + 4;
  app1[p++] = tagOffset & 0xff; app1[p++] = (tagOffset >> 8) & 0xff;
  app1[p++] = 0x00; app1[p++] = 0x00;

  app1[p++] = 0x00; app1[p++] = 0x00; app1[p++] = 0x00; app1[p++] = 0x00; // next IFD offset (0)

  for (let i = 0; i < utf16.length; i++) app1[p++] = utf16[i];

  // Insert APP1 right after SOI (0xFFD8)
  const result = new Uint8Array(2 + app1TotalSize + (bytes.length - 2));
  result[0] = 0xff; result[1] = 0xd8;
  result.set(app1, 2);
  result.set(bytes.subarray(2), 2 + app1TotalSize);
  return result.buffer;
}
