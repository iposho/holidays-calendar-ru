import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { fetchLocalReadme } from '@/utils/readmeFetcher';
import { JsonLd } from '@/components/JsonLd';

import packageJson from '../../package.json';

import css from './page.module.scss';

export default async function HomePage() {
  let markdown = '';

  try {
    markdown = await fetchLocalReadme();
  } catch (error) {
    markdown = 'Не удалось загрузить содержимое README.md.';
  }

  const jsonLdData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: 'https://calendar.kuzyak.in',
    name: 'Производственный календарь РФ API',
    description: 'Производственные календари РФ (2023—2025) в формате JSON. Простой API для получения данных.',
  };

  return (
    <div className={css.main}>
      <JsonLd data={jsonLdData} />

      <div className={css.content}>
        <div className={css.description}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              // eslint-disable-next-line react/no-unstable-nested-components
              img: ({ node, ...props }) => (
                <img {...props} alt={props.alt || ''} />
              ),
            }}
          >
            {markdown}
          </ReactMarkdown>
        </div>
      </div>

      <footer className={css.footer}>
        <div className={css.copyright}>
          <span>
            © 2023...
            {new Date().getFullYear()}
          </span>
          <span>
            <a href="https://kuzyak.in">
              Павел Кузякин
            </a>
          </span>
        </div>
        <div className={css.version}>
          <span>
            <a href="https://github.com/iposho/holidays-calendar-ru">
              {packageJson?.version}
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
}
