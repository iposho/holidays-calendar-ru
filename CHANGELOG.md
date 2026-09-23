# Changelog

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.16.0] - 2026-09-24

### Added
- Производственный календарь на 2027 год (постановление Правительства РФ от 17.09.2026 № 1187)
- `src/data/decrees.json` — постановления Правительства РФ о переносе выходных за 2023–2027 годы со ссылками
- Поле `decree` в ответах `/api/calendar/{year}` и `/api/calendar/{year}/holidays`
- Поля `from` у перенесенных выходных и `workingWeekends` в ответе `/api/calendar/{year}/holidays` (#84)
- Скрипт `npm run update-calendar` — загрузка и разбор календаря с consultant.ru, сборка данных
- Тесты: сверка каждого дня со снимком consultant.ru, годовые нормы рабочего времени, парсер
- **CI**: workflow «Update Calendar» — ручное обновление календаря из GitHub Actions с автоматическим PR в `develop`
- **Docs**: эндпоинт `/api/calendar/{year}/ics` описан в README, Swagger и на главной странице

### Changed
- `holidays` теперь содержит только праздничные дни по ст. 112 ТК РФ (в том числе выпавшие на выходные),
  а перенесенные выходные — в `transferredHolidays` (без дублирования)
- Единые названия праздников для всех годов
- Диапазон доступных годов определяется по данным
- `update-calendar` не перезаписывает снимок consultant.ru, если данные не изменились
- Описание сайта: календари за 2023–2027 годы
- **Deps**: next 16.3.4, axios 1.18.1, dompurify 3.4.16, swagger-ui-react 5.32.11, @babel/core 7.29.7 и другие обновления безопасности

### Fixed
- 2024: 27 апреля — рабочая суббота, 29 апреля — выходной (перенос по постановлению № 1314)
- 2026: 9 января и 31 декабря больше не дублируются в списке праздников (#84)
- **ICS**: перенесенные выходные не дублируются в календаре `.ics`
- **Site**: примеры кода на главной странице использовали несуществующие поля ответа API

## [1.15.0] - 2025-01-15

### Added
- Статические endpoints для максимальной производительности API
- Автоматическая генерация статических JSON файлов при сборке проекта
- Скрипт `scripts/generate-static-api.js` для создания статических файлов
- Оптимизированная стратегия кеширования с ETag валидацией
- Раздельное кеширование для браузеров (24ч) и CDN (1 год)
- Поддержка условных запросов для проверки обновлений

### Changed
- API endpoints теперь обслуживаются статическими файлами вместо серверных вычислений
- Настроены rewrites в next.config.js для перенаправления на статические файлы
- Обновлена документация с описанием статических endpoints и стратегии кеширования
- Улучшена производительность загрузки API данных

### Fixed
- Удалены сгенерированные файлы из Git репозитория для оптимизации размера
- Добавлена папка `/public/static-api/` в .gitignore
- Ускорены Git операции (клонирование, мерж, diff)

## [1.14.0] - 2025-01-04

### Added
- Календарь на 2026 год с полным набором праздников и выходных дней
- Данные праздников 2026 года согласно официальному производственному календарю РФ
- Сокращенные рабочие дни для 2026 года (30 апреля, 8 мая, 11 июня, 3 ноября)
- Перенос выходного дня 31 декабря 2026 года (перенос с 4 января)
- Тесты для проверки корректности данных календаря 2026 года

### Changed
- Обновлен LAST_AVAILABLE_YEAR до 2026 в holidaysLoader.ts
- Расширен диапазон доступных годов в API

## [1.13.1] - 2025-07-04

### Added
- Russian comments in generated TypeScript file
- Documentation update about static API generation

## [1.13.0] - 2025-07-04

### Added
- Static generation of calendar API routes for better performance
- Yandex verification meta tag
- Improved SEO metadata for Google snippet

### Changed
- Optimized caching settings for static data
- Optimized API static generation to reduce build requests
- Updated dependencies (@babel/runtime, dompurify, swagger-ui-react, @babel/runtime-corejs3, axios, next, brace-expansion)

### Fixed
- ESLint issues in `holidaysLoader.ts`

