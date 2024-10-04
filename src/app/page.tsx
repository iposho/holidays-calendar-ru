import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { base16AteliersulphurpoolLight } from 'react-syntax-highlighter/dist/cjs/styles/prism';

import {
  calendarResponse, yearCalendarResponse, holidaysResponse, monthResponse, dayResponse,
} from '@/constants/responses';

import css from './page.module.scss';

export default function Homepage() {
  const codeHighlightStyle = base16AteliersulphurpoolLight;
  return (
    <div className={css.main}>
      <header className={css.header}>
        <h1 className={css.title}>Производственный календарь</h1>
      </header>

      <div className={css.content}>
        <div className={css.description}>
          <p>
            API предоставляет производственные календари в формате JSON, актуальные для Российской Федерации.
          </p>
          <p>
            Доступные годы: с 2023 по 2025.
          </p>
          <p>
            Ссылка на репозиторий:
            {' '}
            <a href="https://github.com/iposho/holidays-calendar-ru/">github.com/iposho/holidays-calendar-ru</a>
            .
          </p>
        </div>

        <div className={css.contents}>
          <h2>Содержание</h2>
          <ul className={css.links}>
            <li>
              <a href="#endpoints">Эндпойнты</a>
            </li>
            <li>
              <a href="#setup">Локальная установка</a>
            </li>
            <li>
              <a href="#contributing">Как внести свой вклад</a>
            </li>
            <li>
              <a href="#license">Лицензия</a>
            </li>
          </ul>
        </div>

        <section className={css.section}>
          <h2 id="endpoints">Эндпойнты</h2>

          <div className={css.endpoint}>
            <h3>Получить все доступные календари</h3>
            <SyntaxHighlighter language="sh" className={css.example} style={codeHighlightStyle}>
              curl -H "Content-Type:application/json" -X GET "https://calendar.kuzyak.in/api/calendar"
            </SyntaxHighlighter>

            <p>Запрос вернет массив имеющихся в наличии календарей.</p>

            <SyntaxHighlighter language="json" style={codeHighlightStyle}>
              {calendarResponse}
            </SyntaxHighlighter>
          </div>

          <div className={css.endpoint}>
            <h3>Получить календарь на конкретный год</h3>
            <SyntaxHighlighter language="sh" className={css.example} style={codeHighlightStyle}>
              curl -H "Content-Type:application/json" -X GET "https://calendar.kuzyak.in/api/calendar/2023"
            </SyntaxHighlighter>

            <p>
              Запрос вернет объект с годом и массивом объектов месяцев. Описание объекта месяца ниже.
            </p>
            <SyntaxHighlighter language="json" style={codeHighlightStyle}>
              {yearCalendarResponse}
            </SyntaxHighlighter>
          </div>

          <div className={css.endpoint}>
            <h3>Получить праздничные и сокращенные дни на конкретный год</h3>
            <SyntaxHighlighter language="sh" className={css.example} style={codeHighlightStyle}>
              curl -H "Content-Type:application/json" -X GET "https://calendar.kuzyak.in/api/calendar/2023/holidays"
            </SyntaxHighlighter>

            <p>Возвращает праздничные и сокращенные предпраздничные дни для конкретного года.</p>
            <SyntaxHighlighter language="json" style={codeHighlightStyle}>
              {holidaysResponse}
            </SyntaxHighlighter>
          </div>

          <div className={css.endpoint}>
            <h3>Получить календарь на конкретный месяц</h3>
            <SyntaxHighlighter language="sh" className={css.example} style={codeHighlightStyle}>
              curl -H "Content-Type:application/json" -X GET "https://calendar.kuzyak.in/api/calendar/2023/1"
            </SyntaxHighlighter>

            <p>
              Вернет объект месяца. Нумерация месяцев начинается с 1, а не с 0. Январь — месяц под номером 1, декабрь — под номером 12.
            </p>
            <p>
              Объект содержит id месяца, имя, количество рабочих, нерабочих и коротких дней,
              а также рабочих часов при восьмичасовой рабочей неделе.
            </p>
            <SyntaxHighlighter language="json" style={codeHighlightStyle}>
              {monthResponse}
            </SyntaxHighlighter>
          </div>

          <div className={css.endpoint}>
            <h3>Получить информацию о конкретном дне</h3>
            <SyntaxHighlighter language="sh" className={css.example} showLineNumbers style={codeHighlightStyle}>
              curl -H "Content-Type:application/json" -X GET "https://calendar.kuzyak.in/api/calendar/2023/2/22"
            </SyntaxHighlighter>

            <p>
              Вернет объект конкретного дня.
            </p>

            <p>
              Объект содержит информацию о месяце, точную дату, признак рабочего/нерабочего/сокращенного,
              название праздника, если день праздничный или предпраздничный.
            </p>

            <SyntaxHighlighter language="json" style={codeHighlightStyle}>
              {dayResponse}
            </SyntaxHighlighter>
          </div>
        </section>

        <section className={css.section}>
          <h2 id="setup">Локальная установка</h2>
          <SyntaxHighlighter language="sh" className={css.example} showLineNumbers style={codeHighlightStyle}>
            {'git clone https://github.com/iposho/holidays-calendar-ru.git\ncd holidays-calendar-ru/\nnpm i\n[...]\nnpm run dev'}
          </SyntaxHighlighter>
        </section>

        <section className={css.section}>
          <h2 id="contributing">Как внести свой вклад</h2>
          <ol className={css.contribution}>
            <li>Форкните этот репозиторий.</li>
            <li>
              Создайте ветку своей фичи (
              <code>git checkout -b my-new-feature</code>
              ).
            </li>
            <li>
              Закоммитьте изменения (
              <code>git commit -am 'Add some feature'</code>
              ).
            </li>
            <li>
              Запушьте изменения в репозиторий (
              <code>git push origin my-new-feature</code>
              ).
            </li>
            <li>Создайте новый пулл-реквест в ветку develop.</li>
          </ol>
        </section>

        <section className={css.section}>
          <h2 id="license">Лицензия</h2>
          <p>
            Это проект с открытым кодом, распространяющийся под лицензией
            {' '}
            <a href="https://github.com/iposho/holidays-calendar-ru/blob/main/LICENSE">MIT License</a>
            .
          </p>
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
