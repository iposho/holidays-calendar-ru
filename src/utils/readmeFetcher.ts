import fs from 'fs';
import path from 'path';

export async function fetchLocalReadme(): Promise<string> {
  const readmePath = path.join(process.cwd(), '', 'README.md');

  try {
    const markdown = await fs.promises.readFile(readmePath, 'utf-8');
    return markdown;
  } catch (error) {
    // eslint-disable-next-line
    console.error('Ошибка при чтении README.md:', error);
    throw new Error('Не удалось прочитать локальный README.md');
  }
}
