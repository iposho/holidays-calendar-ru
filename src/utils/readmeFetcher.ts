import fs from 'fs';
import path from 'path';

let cachedReadme: string | null = null;

export async function fetchLocalReadme(): Promise<string> {
  if (cachedReadme) {
    return cachedReadme;
  }

  const readmePath = path.join(process.cwd(), '', 'README.md');

  try {
    cachedReadme = await fs.promises.readFile(readmePath, 'utf-8');
    return cachedReadme;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Ошибка при чтении README.md:', error);
    throw new Error('Не удалось прочитать локальный README.md');
  }
}
