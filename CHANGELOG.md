# Changelog

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

## [1.13.2] - 2025-07-07

### Changed
- Enabled static rendering for homepage and Swagger page
- Cached README loading to reduce runtime file access

## [1.14.0] - 2025-07-08

### Added
- Pre-generated JSON files for calendar API to avoid edge invocations
### Changed
- Updated build process to generate static API data

## [1.14.1] - 2025-07-08

### Changed
- Removed dynamic Next.js API routes in favor of fully static JSON responses
- Documented usage of `npm run generate:api`


## [1.14.2] - 2025-07-08

### Fixed
- Restored `/api/calendar` endpoint for backward compatibility using static data
