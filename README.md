# Производственный календарь РФ API

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/iposho/holidays-calendar-ru)
![Uptimerobot](https://img.shields.io/uptimerobot/ratio/7/m797301234-a06cf748375429b73d2bee31)
![Vercel](https://vercelbadge.vercel.app/api/iposho/holidays-calendar-ru?style=flat)
![GitHub Size](https://img.shields.io/github/languages/code-size/iposho/holidays-calendar-ru)
![Last Commit](https://img.shields.io/github/last-commit/iposho/holidays-calendar-ru)
![MIT LICENSE](https://img.shields.io/github/license/iposho/holidays-calendar-ru)
[![Build and Push Docker Image](https://github.com/iteterin/holidays-calendar-ru/actions/workflows/docker-publish.yml/badge.svg?branch=main)](https://github.com/iteterin/holidays-calendar-ru/actions/workflows/docker-publish.yml)

![Календарь](public/opengraph-image.png)

📅 API для получения производственных календарей РФ (2023–2027) в формате JSON.

---

## 📚 Содержание

- [👨‍💻 Разработка](#-разработка)
  - [Обновление календаря](#обновление-календаря-добавление-нового-года)
- [🚀 Быстрый старт](#-быстрый-старт)
- [✨ Особенности проекта](#-особенности-проекта)
- [📌 Как получить данные](#-как-получить-данные)
- [🔧 Swagger-документация](#-swagger-документация)
- [🔧 Примеры использования](#-примеры-использования)
- [🧪 Тестирование](#-тестирование)
- [🤝 Как внести вклад](#-как-внести-вклад)
- [📄 Лицензия](#-лицензия)

---

## 👨‍💻 Разработка

### Первый запуск

После клонирования репозитория статические API файлы будут автоматически сгенерированы при первом запуске:

```bash
git clone https://github.com/iposho/holidays-calendar-ru.git
cd holidays-calendar-ru
npm install
npm run dev  # Автоматически сгенерирует статические файлы и запустит dev сервер
```

### Работа с API

Все API endpoints обслуживаются статическими JSON файлами в папке `public/static-api/`. При изменении данных календаря:

```bash
npm run generate-api  # Перегенерировать статические файлы
```

### Структура проекта

- `src/data/` - данные календаря:
  - `holidays.json` — нерабочие праздничные дни по ст. 112 ТК РФ (в том числе выпавшие на выходные);
  - `transferredHolidays.json` — перенесенные выходные (с исходной датой `from`);
  - `workingHolidays.json` — выходные дни, ставшие рабочими из-за переноса;
  - `shortDays.json` — предпраздничные (сокращенные на 1 час) дни;
  - `decrees.json` — постановления Правительства РФ о переносе выходных (реквизиты, ссылка, список переносов);
  - `consultant/{year}.json` — снимки производственного календаря [КонсультантПлюс](https://www.consultant.ru/law/ref/calendar/proizvodstvennye/).
- `scripts/update-calendar.js` - обновление данных с consultant.ru
- `scripts/calendar/` - парсер страницы consultant.ru и сборка данных года с проверками
- `.github/workflows/update-calendar.yml` - запуск обновления календаря из GitHub Actions
- `scripts/generate-static-api.js` - генератор статических API файлов
- `public/static-api/` - сгенерированные статические файлы (игнорируются в Git)

### Обновление календаря (добавление нового года)

Данные обновляет скрипт `npm run update-calendar`. Источники:

- производственный календарь [КонсультантПлюс](https://www.consultant.ru/law/ref/calendar/proizvodstvennye/) —
  нерабочие и сокращенные дни, реквизиты постановления и список переносов;
- постановление Правительства РФ «О переносе выходных дней» — официальный текст ищется
  на [publication.pravo.gov.ru](http://publication.pravo.gov.ru).

Проще всего запускать обновление через GitHub Actions (см. ниже) — локальный запуск нужен для отладки.

#### Команды

```bash
npm run update-calendar -- 2027                    # загрузить страницу consultant.ru и обновить данные
npm run update-calendar -- 2027 --html page.html   # разобрать сохраненную страницу (если сайт недоступен)
npm run update-calendar -- --rebuild               # пересобрать src/data/*.json из сохраненных снимков
npm test                                           # проверить результат
```

#### Что делает скрипт

1. Загружает страницу `https://www.consultant.ru/law/ref/calendar/proizvodstvennye/{год}/` и разбирает
   таблицы 12 месяцев, реквизиты постановления и фразу со списком переносов
   («перенесены следующие выходные дни: с субботы 2 января на пятницу 5 ноября; …»).
2. Если в `src/data/decrees.json` нет записи для года — создает ее: название, номер и дату постановления,
   переносы `{ "from": "...", "to": "..." }`, ссылку на официальный текст (если документ не найден на
   publication.pravo.gov.ru — ссылку на consultant.ru с предупреждением). Существующие записи не перезаписываются.
3. Сверяет переносы с календарем и сохраняет снимок `src/data/consultant/{год}.json`
   (только если нерабочие или сокращенные дни изменились).
4. Пересобирает `holidays.json`, `transferredHolidays.json`, `workingHolidays.json` и `shortDays.json` для всех лет.

Если данные года не прошли проверки, скрипт завершается с ошибкой и не записывает ни снимок, ни `decrees.json`.

#### Проверки, ошибки и предупреждения

| Сообщение | Причина | Что делать |
|---|---|---|
| `вместо календаря на N год получена страница M года` | consultant.ru перенаправил на другой год (так происходит со старыми годами) | Взять страницу из архива и запустить с `--html` |
| `указан проект постановления` | Постановление еще не принято | Дождаться принятия и запустить снова |
| `не найдено постановление о переносе выходных` | На странице нет реквизитов постановления | Добавить запись в `decrees.json` вручную |
| `нерабочие дни без объяснения` | Переносы не объясняют все нерабочие дни календаря | Проверить переносы в `decrees.json` по тексту постановления |
| `перенос с … — это не выходной день`, `перенос на … — это уже выходной день`, `… в источнике это рабочий день` | Переносы противоречат календарю | Исправить переносы в `decrees.json` |
| `найдено N месяцев из 12`, `найдено N дней из M` | Изменилась разметка страницы consultant.ru | Обновить парсер `scripts/calendar/parseConsultant.js` |
| `consultant.ru ответил 403/5xx` | Сайт недоступен или блокирует запрос | Повторить позже или использовать `--html` |
| ⚠️ `постановление не найдено на publication.pravo.gov.ru` | Документ еще не опубликован на портале | Заменить `url` в `decrees.json` на официальную ссылку позже |
| ⚠️ `в decrees.json указано постановление от …` | Номер или дата постановления на странице отличаются от записи | Проверить, не вышло ли новое постановление, и обновить запись вручную |
| ⚠️ `переносы на странице отличаются от decrees.json` | На сайте изменились данные уже добавленного года | Сверить с постановлением и обновить запись вручную |

Тесты (`npm test`) дополнительно сверяют каждый день года со снимком consultant.ru, годовые нормы рабочего
времени и наличие постановления для каждого года.

#### Через GitHub Actions

Workflow **Update Calendar** (`.github/workflows/update-calendar.yml`) запускается вручную и только владельцем
репозитория: *Actions → Update Calendar → Run workflow*, указать год.

Workflow на ветке `develop` выполняет `npm run update-calendar -- <год>` и `npm test`, и если в `src/data/` есть
изменения — создает ветку `calendar/update-<год>-<время>` и открывает PR в `develop`. Если данные не изменились,
PR не создается (об этом написано в сводке запуска).

Чтобы workflow мог открывать PR сам, включите *Settings → Actions → General → Allow GitHub Actions to create and
approve pull requests*. Без этой настройки ветка все равно будет запушена, а ссылка для создания PR появится
в сводке запуска.

#### После добавления нового года

Код и API подхватывают новый год автоматически (диапазон годов определяется по данным). Вручную стоит:

1. Проверить в PR запись в `decrees.json` — реквизиты и ссылку на постановление.
2. Добавить официальную годовую норму (рабочие дни и часы при 40-часовой неделе, есть на странице consultant.ru)
   в `OFFICIAL_NORMS` в `src/helpers/__tests__/calendarData.test.ts` — без нее тест сверяет норму только
   с самими данными.
3. Обновить диапазон годов в текстах: описание сайта в `src/app/layout.tsx`, README, `public/llms.txt`.
4. Добавить запись в `CHANGELOG.md`.

---

## 🚀 Быстрый старт

### Использование API

API поддерживает различные форматы путей для максимальной совместимости:

```bash
# Год
curl "https://calendar.kuzyak.in/api/calendar/2023"

# Месяц (поддерживаются оба формата)
curl "https://calendar.kuzyak.in/api/calendar/2023/01"    # zero-padded
curl "https://calendar.kuzyak.in/api/calendar/2023/1"     # non-padded

# День (поддерживаются все комбинации)
curl "https://calendar.kuzyak.in/api/calendar/2023/01/05" # zero-padded
curl "https://calendar.kuzyak.in/api/calendar/2023/1/5"   # non-padded
curl "https://calendar.kuzyak.in/api/calendar/2023/01/5"   # mixed

# Праздники года
curl "https://calendar.kuzyak.in/api/calendar/2023/holidays"

# Календарь в формате iCalendar (.ics)
curl "https://calendar.kuzyak.in/api/calendar/2027/ics"
```

### Обработка ошибок

API возвращает структурированные JSON ошибки для невалидных запросов:

```bash
# Невалидный год
curl "https://calendar.kuzyak.in/api/calendar/1999"
# {"error":"Invalid year","status":422}

# Невалидный месяц
curl "https://calendar.kuzyak.in/api/calendar/2023/13"
# {"error":"Invalid month","status":422}

# Невалидный день
curl "https://calendar.kuzyak.in/api/calendar/2023/01/40"
# {"error":"Invalid day","status":422}

# Несуществующий день (29 февраля в невисокосном году)
curl "https://calendar.kuzyak.in/api/calendar/2023/02/29"
# {"error":"Invalid day","status":422}
```

**Коды ошибок:**

- `422` - Невалидные параметры (год, месяц, день)
- `404` - Ресурс не найден
- `400` - Неизвестная ошибка

### Локальный запуск

```bash
git clone https://github.com/iposho/holidays-calendar-ru.git
cd holidays-calendar-ru
npm install
npm run dev
```

### Docker

```bash
cp .env.example .env 
docker build . -t holidays-calendar
docker run -p 5000:5000 holidays-calendar
```

---

## ✨ Особенности проекта

- **Простой REST API**: Данные в формате JSON для легкой интеграции.
- **Гибкость**: Запросы на день, месяц или весь год.
- **Swagger-документация**: Удобный интерфейс для просмотра эндпоинтов и тестирования.
- **Docker**: Быстрое развертывание в контейнере.
- **Локальное развертывание**: Минимальные требования для запуска API.
- **Статические endpoints**: API endpoints теперь обслуживаются статическими JSON файлами для максимальной производительности.
- **Автоматическая генерация**: Статические файлы генерируются автоматически при сборке проекта.
- **Долгосрочное кеширование**: Оптимизированные заголовки кеширования для CDN.

---

## 📌 Как получить данные

### 📆 Список доступных календарей

```http
GET /api/calendar
```

### 📅 Календарь на год

```http
GET /api/calendar/{year}
```

### 🎉 Праздничные и сокращенные дни

```http
GET /api/calendar/{year}/holidays
```

Ответ содержит:

- `holidays` — нерабочие праздничные дни по ст. 112 ТК РФ;
- `shortDays` — предпраздничные (сокращенные) дни;
- `transferredHolidays` — перенесенные выходные с исходной датой (`from`), например 9 января 2026 года — перенос с 3 января;
- `workingWeekends` — выходные дни, ставшие рабочими;
- `decree` — постановление Правительства РФ о переносе выходных дней со ссылкой на текст.

```json
{
  "year": 2026,
  "transferredHolidays": [
    { "date": "2026-01-09T00:00:00.000Z", "name": "Перенесенный выходной с 3 января", "from": "2026-01-03T00:00:00.000Z" }
  ],
  "decree": {
    "title": "Постановление Правительства РФ от 24.09.2025 № 1466 «О переносе выходных дней в 2026 году»",
    "number": "1466",
    "date": "2025-09-24",
    "url": "http://publication.pravo.gov.ru/document/0001202509240023",
    "calendarUrl": "https://www.consultant.ru/law/ref/calendar/proizvodstvennye/2026/"
  }
}
```

### 🗓️ Подписка на календарь и формат iCalendar

```http
GET /api/calendar/ics
GET /api/calendar/{year}/ics
```

- **Постоянная подписка (все годы)**: `https://calendar.kuzyak.in/api/calendar/ics` (или `webcal://calendar.kuzyak.in/api/calendar/ics`). Файл `.ics` со всеми доступными годами (2023–2027+), поддержкой автообновления раз в неделю и автоматическим получением новых переносов.
- **Календарь на выбранный год**: `https://calendar.kuzyak.in/api/calendar/2027/ics`.
- Подходит для подписки в Google Calendar, Apple Calendar, Outlook и Яндекс Календаре.

### 📆 Календарь на месяц

```http
GET /api/calendar/{year}/{month}
```

### 📅 Информация о конкретном дне

```http
GET /api/calendar/{year}/{month}/{day}
```

---

## ⚡ Производительность

### Статические endpoints

Все API endpoints теперь обслуживаются статическими JSON файлами, что обеспечивает:

- **Мгновенную загрузку**: Статические файлы загружаются без серверных вычислений
- **Оптимальное кеширование**: Умная стратегия кеширования с ETag для баланса производительности и актуальности данных
- **CDN-дружественность**: Легкое развертывание через CDN для глобальной доступности
- **Надежность**: Нет зависимости от серверных ресурсов для API

### Автоматическая генерация

Статические файлы генерируются автоматически при разработке и сборке проекта:

```bash
npm run dev     # Автоматически генерирует статические файлы перед запуском dev сервера
npm run build   # Автоматически генерирует статические файлы перед сборкой
npm run generate-api  # Ручная генерация статических файлов
```

### Стратегия кеширования

Оптимизированная стратегия кеширования для API endpoints:

- **CDN кеширование**: `s-maxage=31536000` (1 год) - долгосрочное кеширование в CDN для максимальной производительности
- **ETag валидация**: Динамические ETag на основе версии и даты сборки для проверки обновлений
- **Условные запросы**: Клиенты проверяют актуальность через `If-None-Match` заголовки, получая 304 Not Modified при отсутствии изменений

**Преимущества:**

- CDN обеспечивает быструю доставку данных по всему миру
- Клиенты всегда получают актуальные данные через условные запросы
- Минимальный трафик при отсутствии изменений (304 ответы)
- Максимальная производительность при наличии изменений

---

## 🔧 Swagger-документация

Полная документация доступна по ссылке:  
[**Swagger UI**](https://calendar.kuzyak.in/swagger)

Вы можете использовать Swagger UI для тестирования и изучения всех доступных маршрутов и их параметров.

---

## 🔧 Примеры использования

### 🐍 Python

```python
import requests

response = requests.get("https://calendar.kuzyak.in/api/calendar/2024")
print(response.json())
```

### 📜 JavaScript

```javascript
fetch("https://calendar.kuzyak.in/api/calendar/2024")
  .then((res) => res.json())
  .then((data) => console.log(data));
```

### 🐘 PHP

```php
<?php
$response = file_get_contents("https://calendar.kuzyak.in/api/calendar/2024");
$data = json_decode($response, true);
print_r($data);
?>
```

### 💻 Curl

```bash
curl -H "Content-Type:application/json" -X GET "https://calendar.kuzyak.in/api/calendar/2024"
```

---

## 🧪 Тестирование

1. Запуск тестов:

   ```bash
   npm test
   ```

2. Покрытие кода:

   ```bash
   npm run test:coverage
   ```

---

## 🤝 Как внести вклад

1. Форкните репозиторий: [Fork this repo](https://github.com/iposho/holidays-calendar-ru/fork)
2. Создайте ветку:

   ```bash
   git checkout -b my-feature
   ```

3. Добавьте изменения и тесты:

   ```bash
   git commit -m "feat: добавил новую фичу"
   ```

4. Запушьте изменения:

   ```bash
   git push origin my-feature
   ```

5. Создайте пулл-реквест в ветку `develop`.

---

## 📄 Лицензия

Этот проект распространяется под лицензией [MIT](LICENSE).
