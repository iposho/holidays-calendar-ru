const express = require('express');
const app = express();
const port = 4000;

const {
  generateMonths,
  generateMonth,
  isWorkingDay,
  isNotCorrectYear,
  isNotCorrectDay,
  isNotCorrectMonth,
  getErrorMessages,
  availableYears,
  createMainPage,
  generateHolidays,
} = require('./helpers');

// Middleware to handle common error scenarios
function handleErrors(errorType, req, res, next) {
  const { year, month, day } = req.params;

  if (errorType === 'year' && isNotCorrectYear(year)) {
    res.status(400).json(getErrorMessages('year'));
  } else if (errorType === 'month' && isNotCorrectMonth(month)) {
    res.status(400).json(getErrorMessages('month'));
  } else if (errorType === 'day' && isNotCorrectDay(year, month, day)) {
    res.status(400).json(getErrorMessages('day'));
  } else {
    next();
  }
}

app.get('/', (req, res) => {
  createMainPage(res);
});

app.get('/api', (req, res) => {
  res.status(400).json(getErrorMessages('path'));
});

app.get('/api/calendar/', (req, res) => {
  res.status(200).json({ years: availableYears(), status: 200 });
});

app.get('/api/calendar/:year', handleErrors.bind(null, 'year'), (req, res) => {
  const { year } = req.params;
  const data = generateMonths(year);
  res.status(200).json({ year: Number(year), months: data, status: 200 });
});

app.get('/api/calendar/:year/holidays', handleErrors.bind(null, 'year'), (req, res) => {
  const { year } = req.params;
  const data = generateHolidays(year);
  res.status(200).json({ year: Number(year), ...data, status: 200 });
});

app.get(
  '/api/calendar/:year/:month',
  handleErrors.bind(null, 'month'),
  handleErrors.bind(null, 'year'),
  (req, res) => {
    const { year, month } = req.params;
    const data = generateMonth(year, month);
    res.status(200).json({ year: Number(year), month: data, status: 200 });
  }
);

app.get(
  '/api/calendar/:year/:month/:day',
  handleErrors.bind(null, 'day'),
  handleErrors.bind(null, 'month'),
  handleErrors.bind(null, 'year'),
  (req, res) => {
    const { year, month, day } = req.params;
    const data = isWorkingDay(year, month, day);
    res.status(200).json({ ...data, status: 200 });
  }
);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.info(`Server is listening on port ${port}`);
});
