const express = require('express');

const { generateMonths } = require('./helpers/generateMonths');
const { generateMonth } = require('./helpers/generateMonth');
const { isWorkingDay } = require('./helpers/isWorkingDay');
const { isNotCorrectYear, isNotCorrectDay, isNotCorrectMonth } = require('./helpers/isNotCorrect');
const { getErrorMessages } = require('./helpers/getErrorMessages');
const { availableYears } = require('./helpers/availableYears');
const { createMainPage } = require('./helpers/createMainPage');

const app = express();
const port = 4000;

app.get('/', (req, res) => {
  createMainPage(res);
});

app.get('/api', (req, res) => {
  res.status(400).json(getErrorMessages('path'));
});

app.get('/api/calendar/', (req, res) => {
  res.status(200).json({ years: availableYears(), status: 200 });
});

app.get('/api/calendar/:year', (req, res) => {
  const { year } = req.params;

  if (isNotCorrectYear(year)) {
    res.status(400).json(getErrorMessages('year'));
  } else {
    const data = generateMonths(year);
    res.status(200).json({ year: Number(year), months: data, status: 200 });
  }
});

app.get('/api/calendar/:year/:month', (req, res) => {
  const { month, year } = req.params;

  if (isNotCorrectYear(year)) {
    res.status(400).json(getErrorMessages('year'));
  } else if (isNotCorrectMonth(month)) {
    res.status(400).json(getErrorMessages('month'));
  } else {
    const data = generateMonth(year, month);
    res.status(200).json({ year: Number(year), month: data, status: 200 });
  }
});

app.get('/api/calendar/:year/:month/:day', (req, res) => {
  const { day, month, year } = req.params;

  if (isNotCorrectYear(year)) {
    res.status(400).json(getErrorMessages('year'));
  } else if (isNotCorrectMonth(month)) {
    res.status(400).json(getErrorMessages('month'));
  } else if (isNotCorrectDay(year, month, day)) {
    res.status(400).json(getErrorMessages('day'));
  } else {
    const data = isWorkingDay(year, month, day);
    res.status(200).json({ ...data, status: 200 });
  }
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.info(`Server is listening on port ${port}`);
});
