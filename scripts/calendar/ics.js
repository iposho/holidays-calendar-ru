/*
  Сериализация iCalendar по RFC 5545.
*/

// Экранирование значений типа TEXT (разд. 3.3.11)
const escapeText = (text) => text
  .replace(/\\/g, '\\\\')
  .replace(/;/g, '\\;')
  .replace(/,/g, '\\,')
  .replace(/\r?\n/g, '\\n');

// Перенос строк длиннее 75 байт (разд. 3.1): продолжение начинается с пробела,
// многобайтовые символы UTF-8 не разрываются
const MAX_LINE_BYTES = 75;
const foldLine = (line) => {
  const parts = [];
  let current = '';
  let bytes = 0;
  Array.from(line).forEach((char) => {
    const size = Buffer.byteLength(char, 'utf8');
    // У строк продолжения первый байт занимает пробел
    const limit = parts.length ? MAX_LINE_BYTES - 1 : MAX_LINE_BYTES;
    if (bytes + size > limit) {
      parts.push(current);
      current = '';
      bytes = 0;
    }
    current += char;
    bytes += size;
  });
  parts.push(current);
  return parts.join('\r\n ');
};

// Строки разделяются CRLF, в том числе после последней
const serializeIcs = (lines) => `${lines.map(foldLine).join('\r\n')}\r\n`;

module.exports = { escapeText, foldLine, serializeIcs };
