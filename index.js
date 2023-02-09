const express = require('express');

const { generateMonths } = require('./helpers/generateMonths');
const { generateMonth } = require('./helpers/generateMonth');
const { isWorkingDay } = require('./helpers/isWorkingDay');

const app = express();
const port = 5000;

app.get('/', (req, res) => {
  res.status(500).json({ error: 'Invalid API path', status: 500 });
});

app.get('/api/year/:year', (req, res) => {
  const { year } = req.params;

  if (year < 2023 || year > 2024) {
    res.status(500).json({ error: 'Invalid year', status: 500 });
  } else {
    const data = generateMonths(year);
    res.send({ months: data, status: 'ok' });
  }
});

app.get('/api/year/:year/:month', (req, res) => {
  const { month, year } = req.params;

  if (year < 2023 || year > 2024) {
    res.status(500).json({ error: 'Invalid year', status: 500 });
  } else {
    const data = generateMonth(year, month);
    res.send({ month: data, status: 'ok' });
  }
});

app.get('/api/year/:year/:month/:day', (req, res) => {
  const { day, month, year } = req.params;

  if (year < 2023 || year > 2024) {
    res.status(500).json({ error: 'Invalid year', status: 500 });
  } else {
    const data = isWorkingDay(year, month, day);
    res.send({ isWorkingDay: data, status: 'ok' });
  }
});

app.listen(port, () => {
  console.info(`Server is listening on port ${port}`);
});
