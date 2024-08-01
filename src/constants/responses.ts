export const calendarResponse = `{
  "years": [
    2023,
    2024
  ],
  "status": 200
}`;

export const yearCalendarResponse = `{
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
}`;

export const holidaysResponse = `{
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
}`;

export const monthResponse = `{
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
}`;

export const dayResponse = `{
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
}`;
