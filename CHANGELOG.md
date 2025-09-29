# Changelog

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.16.0] - 2025-09-29

### Added
- iCalendar (.ics) exports for every available year with complete day-level metadata.
- Rewrites and headers for serving `.ics` files via `/api/calendar/{year}.ics`.

### Changed
- Documentation updated with instructions for downloading yearly `.ics` files.

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

