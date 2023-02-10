![Vercel](https://vercelbadge.vercel.app/api/iposho/holidays-calendar-ru?style=flat) ![GitHub Size](https://img.shields.io/github/languages/code-size/iposho/holidays-calendar-ru) ![Last Commit](https://img.shields.io/github/last-commit/iposho/holidays-calendar-ru) ![MIT LICENSE](https://img.shields.io/github/license/iposho/holidays-calendar-ru)
# Производственный календарь
Производственные календари в формате JSON, актуальные для Российской Федерации.

Первый доступный год — 2023, последний — 2024.

## Примеры использования

### /api/calendar/
```bash
curl -H "Content-Type:application/json" -X GET "https://holidays-calendar-ru.vercel.app/api/calendar"
```
Вернет массив имеющихся в наличии календарей.
```json
{
  "years": [
    2023,
    2024
  ],
  "status": 200
}
```
<br>

### /api/calendar/:year
```bash
curl -H "Content-Type:application/json" -X GET "https://holidays-calendar-ru.vercel.app/api/calendar/2023"
```
Вернет объект с годом и массивом объектов месяцев. Описание объекта месяца ниже.
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
    },
    ...
  ],
  "status": 200
}
```
<br>

### /api/calendar/:year/:month/
```bash
curl -H "Content-Type:application/json" -X GET "https://holidays-calendar-ru.vercel.app/api/calendar/2023/1"
```
Вернет объект месяца. Нумерация месяцев начинается с 1, а не с 0. Январь — месяц под номером 1, декабрь — под номером 12.

Объект содержит id месяца, имя, количество рабочих, нерабочих и коротких дней, а также рабочих часов при восьмичасовой рабочей неделе.
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
<br>

### /api/calendar/:year/:month/:day
```bash
curl -H "Content-Type:application/json" -X GET "https://holidays-calendar-ru.vercel.app/api/calendar/2023/3/7"
```
Вернет объект конкретного дня.

Объект содержит информацию о месяце, точную дату, признак рабочего/нерабочего дня и название праздника, если день праздничный.
```json
{
  "year": 2023,
  "month": {
    "name": "March",
    "id": 2
  },
  "date": "2023-03-07T00:00:00.000Z",
  "isWorkingDay": true,
  "shortday": "Международный женский день",
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

## Лицензия
Это проект с открытым кодом, распространяющийся под лицензией [MIT License](LICENSE).
