import React from 'react';

import css from './page.module.scss';

export default function Homepage() {
  return (
    <div className={css.main}>
      <header className={css.header}>
        <h1 className={css.title}>Производственный календарь 🇷🇺</h1>
      </header>

      <div className={css.content}>
        <div className={css.description}>
          <p>
            Производственные календари РФ (2023—2025) в формате JSON. Простой API для получения данных.
          </p>
        </div>

        <section className={css.links}>
          <a className={css.link} href="https://github.com/iposho/holidays-calendar-ru?tab=readme-ov-file#примеры-запросов">📔 Документация</a>
        </section>
      </div>
      <footer className={css.footer}>
        <div className={css.badges}>
          <img src="https://img.shields.io/uptimerobot/ratio/7/m797301234-a06cf748375429b73d2bee31" alt="Uptinerobot" />
          <img src="https://vercelbadge.vercel.app/api/iposho/holidays-calendar-ru?style=flat" alt="Vercel" />
          <img src="https://img.shields.io/github/languages/code-size/iposho/holidays-calendar-ru" alt="GitHub Size" />
          <img src="https://img.shields.io/github/last-commit/iposho/holidays-calendar-ru" alt="Last Commit" />
          <img src="https://img.shields.io/github/license/iposho/holidays-calendar-ru" alt="MIT LICENSE" />
        </div>
        <div className={css.copyright}>
          <span>
            {`© 2023...${new Date().getFullYear()}`}
          </span>
          <span>
            <a href="https://kuzyak.in">Павел Кузякин</a>
          </span>
        </div>
      </footer>
    </div>
  );
}
