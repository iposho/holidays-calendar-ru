const express = require('express');
const path = require('path');
const fs = require('fs');
const { isNotCorrectYear, isNotCorrectMonth, isNotCorrectDay } = require('./helpers/isNotCorrect');
const { getErrorMessages } = require('./helpers/getErrorMessages');
const { availableYears } = require('./helpers/availableYears');
const { createMainPage } = require('./helpers/createMainPage');
const app = express();
const port = 4000;

const getDataFilePath = (year, fileName) => path.join(__dirname, 'data', 'generated', String(year), fileName);

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
    const filePath = getDataFilePath(year, 'months.json');
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath));
      res.status(200).json(data);
    } else {
      res.status(404).json({ error: 'Data not found', status: 404 });
    }
  }
});

app.get('/api/calendar/:year/holidays', (req, res) => {
  const { year } = req.params;

  if (isNotCorrectYear(year)) {
    res.status(400).json(getErrorMessages('year'));
  } else {
    const filePath = getDataFilePath(year, 'holidays.json');
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath));
      res.status(200).json(data);
    } else {
      res.status(404).json({ error: 'Data not found', status: 404 });
    }
  }
});

app.get('/api/calendar/:year/:month', (req, res) => {
  const { year, month } = req.params;

  if (isNotCorrectYear(year)) {
    res.status(400).json(getErrorMessages('year'));
  } else if (isNotCorrectMonth(month)) {
    res.status(400).json(getErrorMessages('month'));
  } else {
    const filePath = getDataFilePath(year, `${month}.json`);
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath));
      const { days, ...monthData } = data;  // Удаляем поле days из ответа
      res.status(200).json(monthData);
    } else {
      res.status(404).json({ error: 'Data not found', status: 404 });
    }
  }
});

app.get('/api/calendar/:year/:month/:day', (req, res) => {
  const { year, month, day } = req.params;

  if (isNotCorrectYear(year)) {
    res.status(400).json(getErrorMessages('year'));
  } else if (isNotCorrectMonth(month)) {
    res.status(400).json(getErrorMessages('month'));
  } else if (isNotCorrectDay(year, month, day)) {
    res.status(400).json(getErrorMessages('day'));
  } else {
    const filePath = getDataFilePath(year, `${month}.json`);
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath));

      if (!data.days) {
        return res.status(400).json({ error: 'Days data not found', status: 400 });
      }

      const dayData = data.days.find(d => d.date.split('T')[0] === `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);

      if (!dayData) {
        return res.status(400).json({ error: 'Day data not found', status: 400 });
      }

      res.status(200).json({ year: Number(year), ...dayData, status: 200 });
    } else {
      res.status(404).json({ error: 'Data not found', status: 404 });
    }
  }
});

app.listen(port, () => {
  console.info(`Server is listening on port ${port}`);
});
