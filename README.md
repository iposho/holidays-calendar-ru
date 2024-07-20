![Uptimerobot](https://img.shields.io/uptimerobot/ratio/7/m797301234-a06cf748375429b73d2bee31) ![Vercel](https://vercelbadge.vercel.app/api/iposho/holidays-calendar-ru?style=flat) ![GitHub Size](https://img.shields.io/github/languages/code-size/iposho/holidays-calendar-ru) ![Last Commit](https://img.shields.io/github/last-commit/iposho/holidays-calendar-ru) ![MIT LICENSE](https://img.shields.io/github/license/iposho/holidays-calendar-ru)
# Производственный календарь
API предоставляет производственные календари в формате JSON, актуальные для Российской Федерации. Доступные годы: с 2023 по 2024.

Ссылка на репозиторий: [GitHub - holidays-calendar-ru](https://github.com/iposho/holidays-calendar-ru)

## Содержание
- [API Эндпойнты](#api-эндпоинты)
  - [Получить все доступные календари](#получить-все-доступные-календари)
  - [Получить календарь на конкретный год](#получить-календарь-на-конкретный-год)
  - [Получить праздничные и сокращенные дни на конкретный год](#получить-праздничные-и-сокращенные-дни-на-конкретный-год)
  - [Получить календарь на конкретный месяц](#получить-календарь-на-конкретный-месяц)
  - [Получить информацию о конкретном дне](#получить-информацию-о-конкретном-дне)
- [Локальная установка](#локальная-установка)
- [Как внести свой вклад](#как-внести-свой-вклад)
- [Лицензия](#лицензия)


## API Эндпоинты

### Получить все доступные календари

`GET /api/calendar`

```sh
curl -H "Content-Type:application/json" -X GET "https://calendar.kuzyak.in/api/calendar"
```

#### Ответ

```json
{
  "years": [
    2023,
    2024
  ],
  "status": 200
}
```

### Получить календарь на конкретный год

`GET /api/calendar/:year`

```sh
curl -H "Content-Type:application/json" -X GET "https://calendar.kuzyak.in/api/calendar/2023"
```

#### Ответ

```json
{
  "year": 2023,
  "months": [
    {
      "id": 0,
      "name": "January",
      "workingDays": 17,
      "notWorkingDays": 14,
      "shortDays": 0,
      "workingHours": 136
    }
    // ... Другие месяцы
  ],
  "status": 200
}
```

### Получить праздничные и сокращенные дни на конкретный год

`GET /api/calendar/:year/holidays`

```sh
curl -H "Content-Type:application/json" -X GET "https://calendar.kuzyak.in/api/calendar/2023/holidays"
```

#### Ответ

```json
{
  "year": 2023,
  "holidays": [
    {
      "date": "2023-01-01T00:00:00.000Z",
      "name": "Новый год"
    }
    // ... Другие праздники
  ],
  "shortDays": [
    {
      "date": "2023-02-22T00:00:00.000Z",
      "name": "День защитника Отечества"
    }
    // ... Другие сокращенные дни
  ],
  "status": 200
}
```

### Получить календарь на конкретный месяц

`GET /api/calendar/:year/:month`

```sh
curl -H "Content-Type:application/json" -X GET "https://calendar.kuzyak.in/api/calendar/2023/1"
```

#### Ответ

```json
{
  "year": 2023,
  "month": {
    "id": 0,
    "name": "January",
    "workingDays": 17,
    "notWorkingDays": 14,
    "shortDays": 0,
    "workingHours": 136
  },
  "status": 200
}
```

### Получить информацию о конкретном дне

`GET /api/calendar/:year/:month/:day`

```sh
curl -H "Content-Type:application/json" -X GET "https://calendar.kuzyak.in/api/calendar/2023/2/22"
```

#### Ответ

```json
{
  "year": 2023,
  "month": {
    "name": "February",
    "id": 1
  },
  "date": "2023-02-22T00:00:00.000Z",
  "isWorkingDay": true,
  "isShortday": true,
  "holiday": "День защитника Отечества",
  "status": 200
}
```
<br>

## Локальная установка
```bash
git clone https://github.com/iposho/holidays-calendar-ru.git
cd holidays-calendar-ru/
npm i
[...]
npm run dev
```
<br>

## Как внести свой вклад
1. [Форкните](https://github.com/iposho/holidays-calendar-ru/fork) этот репозиторий.
2. Создайте ветку своей фичи (`git checkout -b my-new-feature`).
3. Закоммитьте изменения (`git commit -am 'Add some feature'`).
4. Запушьте изменения в репозиторий (`git push origin my-new-feature`).
5. Создайте новый пулл-реквест в ветку develop.
<br>

## Лицензия
Это проект с открытым кодом, распространяющийся под лицензией [MIT License](LICENSE).
