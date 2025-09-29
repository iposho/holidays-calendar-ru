# Changelog

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

