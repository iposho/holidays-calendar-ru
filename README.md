![Uptimerobot](https://img.shields.io/uptimerobot/ratio/7/m797301234-a06cf748375429b73d2bee31) ![Vercel](https://vercelbadge.vercel.app/api/iposho/holidays-calendar-ru?style=flat) ![GitHub Size](https://img.shields.io/github/languages/code-size/iposho/holidays-calendar-ru) ![Last Commit](https://img.shields.io/github/last-commit/iposho/holidays-calendar-ru) ![MIT LICENSE](https://img.shields.io/github/license/iposho/holidays-calendar-ru) [![Build and Push Docker Image](https://github.com/iteterin/holidays-calendar-ru/actions/workflows/docker-publish.yml/badge.svg?branch=main)](https://github.com/iteterin/holidays-calendar-ru/actions/workflows/docker-publish.yml)
# Производственный календарь 🇷🇺

<img src="./src/app/opengraph-image.png" />

## TL;DR
Производственные календари РФ (2023—2025) в формате JSON. Простой API для получения данных.

## Содержание
- [Как получить](#как-получить)
  - [Список доступных календарей](#список-доступных-календарей)
  - [Календарь на год](#календарь-на-год)
  - [Праздничные и сокращенные дни в году](#праздничные-и-сокращенные-дни-в-году)
  - [Календарь на месяц](#календарь-на-месяц)
  - [Информацию о конкретном дне](#информацию-о-конкретном-дне)
- [Локальная установка](#локальная-установка)
- [Как внести свой вклад](#как-внести-свой-вклад)
- [Лицензия](#лицензия)


## Как получить

### Список доступных календарей

```openapi generator
GET /api/calendar
```

```sh
curl -H "Content-Type:application/json" -X GET "https://calendar.kuzyak.in/api/calendar"
```

Запрос вернет массив имеющихся в наличии календарей.

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

### Календарь на год

```openapi generator
GET /api/calendar/:year
```

```sh
curl -H "Content-Type:application/json" -X GET "https://calendar.kuzyak.in/api/calendar/2023"
```

Запрос вернет объект с годом и массивом объектов месяцев.

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

### Праздничные и сокращенные дни в году

```openapi generator
GET /api/calendar/:year/holidays
```

```sh
curl -H "Content-Type:application/json" -X GET "https://calendar.kuzyak.in/api/calendar/2023/holidays"
```

Возвращаются праздничные и сокращенные предпраздничные дни для конкретного года.

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

### Календарь на месяц

```openapi generator
GET /api/calendar/:year/:month
```

```sh
curl -H "Content-Type:application/json" -X GET "https://calendar.kuzyak.in/api/calendar/2023/1"
```

Вернет объект месяца. Нумерация месяцев начинается с 1, а не с 0. Январь — месяц под номером 1, декабрь — под номером 12.

Объект содержит id месяца, имя, количество рабочих, нерабочих и коротких дней, а также рабочих часов при восьмичасовой рабочей неделе.

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

### Информацию о конкретном дне

```openapi generator
GET /api/calendar/:year/:month/:day
```

```sh
curl -H "Content-Type:application/json" -X GET "https://calendar.kuzyak.in/api/calendar/2023/2/22"
```

Вернется объект конкретного дня.

Объект содержит информацию о месяце, точную дату, признак рабочего/нерабочего/сокращенного, название праздника, если день праздничный или предпраздничный.

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

## Сбора в контейнер
```bash
git clone https://github.com/iposho/holidays-calendar-ru.git
cd holidays-calendar-ru/
#При необходимости использовании Яндекс Метрики, указать в .env ID YANDEX_METRIKA_ID=
cp .env.example .env 
docker build . -t holidays-calendar
docker run -p 5000:5000 holidays-calendar
#либо с использованием Яндекс Метрики
docker run -p 5000:5000 -e YANDEX_METRIKA_ID=XXX-XXX-XXX holidays-calendar
```

## Как внести свой вклад
1. [Форкните](https://github.com/iposho/holidays-calendar-ru/fork) этот репозиторий.
2. Создайте ветку своей фичи (`git checkout -b my-new-feature`).
3. Закоммитьте изменения (`git commit -am 'Add some feature'`).
4. Запушьте изменения в репозиторий (`git push origin my-new-feature`).
5. Создайте новый пулл-реквест в ветку develop.
<br>

## Лицензия
Это проект с открытым кодом, распространяющийся под лицензией [MIT License](LICENSE).
