import fs from 'fs';
import path from 'path';
import { remark } from 'remark';
import html from 'remark-html';

export const getReadmeContent = async (): Promise<string> => {
  const filePath = path.join(process.cwd(), 'README.md');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const processedContent = await remark().use(html).process(fileContents);
  return processedContent.toString();
};
