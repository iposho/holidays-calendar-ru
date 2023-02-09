const express = require('express');

const { generateMonths } = require('./helpers/generateMonths');
const { generateMonth } = require('./helpers/generateMonth');
const { isWorkingDay } = require('./helpers/isWorkingDay');
const { isCorrectYear, isCorrectDay, isCorrectMonth } = require('./helpers/isCorrect');
const { addEntryToRequestsLog, addEntryToErrorLog } = require('./libs/logger');

const app = express();
const port = 5000;

app.get('/', (req, res) => {
  res.status(500).json({ error: 'Invalid API path', status: 500 });
});

app.get('/api/calendar/:year', (req, res) => {
  const { year } = req.params;

  if (isCorrectYear(year)) {
    const errObj = { error: 'Invalid year', status: 500 };
    addEntryToErrorLog(req, errObj);
    res.status(500).json(errObj);
  } else {
    const data = generateMonths(year);
    addEntryToRequestsLog(req);
    res.send({ year: Number(year), months: data, status: 200 });
  }
});

app.get('/api/calendar/:year/:month', (req, res) => {
  const { month, year } = req.params;

  if (isCorrectYear(year)) {
    const errObj = { error: 'Invalid year', status: 500 };
    addEntryToErrorLog(req, errObj);
    res.status(500).json(errObj);
  } else if (isCorrectMonth(month)) {
    const errObj = { error: 'Invalid month', status: 500 };
    addEntryToErrorLog(req, errObj);
    res.status(500).json(errObj);
  } else {
    const data = generateMonth(year, month);
    addEntryToRequestsLog(req);
    res.send({ year: Number(year), month: data, status: 200 });
  }
});

app.get('/api/calendar/:year/:month/:day', (req, res) => {
  const { day, month, year } = req.params;

  if (isCorrectYear(year)) {
    const errObj = { error: 'Invalid year', status: 500 };
    addEntryToErrorLog(req, errObj);
    res.status(500).json(errObj);
  } else if (isCorrectMonth(month)) {
    const errObj = { error: 'Invalid month', status: 500 };
    addEntryToErrorLog(req, errObj);
    res.status(500).json(errObj);
  } else if (isCorrectDay(year, month, day)) {
    const errObj = { error: 'Invalid day', status: 500 };
    addEntryToErrorLog(req, errObj);
    res.status(500).json(errObj);
  } else {
    const data = isWorkingDay(year, month, day);
    addEntryToRequestsLog(req);
    res.status(200).json({ ...data, status: 200 });
  }
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.info(`Server is listening on port ${port}`);
});
