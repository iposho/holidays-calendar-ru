const express = require('express');

const { generateMonths } = require('./helpers/generateMonths');
const { generateMonth } = require('./helpers/generateMonth');
const { isWorkingDay } = require('./helpers/isWorkingDay');
const { isCorrectYear, isCorrectDay, isCorrectMonth } = require('./helpers/isCorrect');

const app = express();
const port = 5000;

app.get('/', (req, res) => {
  res.status(500).json({ error: 'Invalid API path', status: 500 });
});

app.get('/api/calendar/:year', (req, res) => {
  const { year } = req.params;

  if (isCorrectYear(year)) {
    res.status(500).json({ error: 'Invalid year', status: 500 });
  } else {
    const data = generateMonths(year);
    res.send({ year: Number(year), months: data, status: 'ok' });
  }
});

app.get('/api/calendar/:year/:month', (req, res) => {
  const { month, year } = req.params;

  if (isCorrectYear(year)) {
    res.status(500).json({ error: 'Invalid year', status: 500 });
  } else if (isCorrectMonth(month)) {
    res.status(500).json({ error: 'Invalid month', status: 500 });
  } else {
    const data = generateMonth(year, month);
    res.send({ year: Number(year), month: data, status: 'ok' });
  }
});

app.get('/api/calendar/:year/:month/:day', (req, res) => {
  const { day, month, year } = req.params;

  if (isCorrectYear(year)) {
    res.status(500).json({ error: 'Invalid year', status: 500 });
  } else if (isCorrectMonth(month)) {
    res.status(500).json({ error: 'Invalid month', status: 500 });
  } else if (isCorrectDay(year, month, day)) {
    res.status(500).json({ error: 'Invalid day', status: 500 });
  } else {
    const data = isWorkingDay(year, month, day);
    res.status(200).json({ ...data, status: 'ok' });
  }
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.info(`Server is listening on port ${port}`);
});
