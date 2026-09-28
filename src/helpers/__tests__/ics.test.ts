import { escapeText, foldLine, serializeIcs } from '../../../scripts/calendar/ics';

describe('escapeText', () => {
  it('экранирует обратную косую черту, точку с запятой, запятую и перевод строки', () => {
    expect(escapeText('a\\b;c,d\ne\r\nf')).toBe('a\\\\b\\;c\\,d\\ne\\nf');
  });

  it('не меняет текст без спецсимволов', () => {
    expect(escapeText('Перенесенный выходной с 3 января')).toBe('Перенесенный выходной с 3 января');
  });
});

describe('foldLine', () => {
  it('не трогает строки до 75 байт', () => {
    const line = 'x'.repeat(75);
    expect(foldLine(line)).toBe(line);
  });

  it('переносит длинные строки, не разрывая символы UTF-8', () => {
    const line = `SUMMARY:${'Праздник '.repeat(20)}`;
    const folded = foldLine(line);
    const parts = folded.split('\r\n');
    expect(parts.length).toBeGreaterThan(1);
    parts.forEach((part, i) => {
      expect(Buffer.byteLength(part, 'utf8')).toBeLessThanOrEqual(75);
      if (i > 0) expect(part.startsWith(' ')).toBe(true);
    });
    expect(folded.replace(/\r\n /g, '')).toBe(line);
  });
});

describe('serializeIcs', () => {
  it('разделяет строки CRLF и завершает CRLF', () => {
    expect(serializeIcs(['BEGIN:VCALENDAR', 'END:VCALENDAR'])).toBe('BEGIN:VCALENDAR\r\nEND:VCALENDAR\r\n');
  });
});
