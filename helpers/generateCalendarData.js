const fs = require('fs');
const path = require('path');
const { generateMonths } = require('./generateMonths');
const { generateMonth } = require('./generateMonth');
const { generateHolidays } = require('./generateHolidays');
const { availableYears } = require('./availableYears');
const { isWorkingDay } = require('./isWorkingDay');
const { getDaysCount } = require('./getDaysCount');

const outputDir = path.join(__dirname, '../data/generated');

try {
  availableYears().forEach(year => {
    const yearDir = path.join(outputDir, String(year));
    if (!fs.existsSync(yearDir)) {
      fs.mkdirSync(yearDir, { recursive: true });
    }

    const monthsData = generateMonths(year).map(month => ({
      id: month.id,
      name: month.name,
      workingDays: month.workingDays,
      notWorkingDays: month.notWorkingDays,
      shortDays: month.shortDays,
      workingHours: month.workingHours
    }));
    fs.writeFileSync(path.join(yearDir, 'months.json'), JSON.stringify({ year, months: monthsData, status: 200 }, null, 2));

    monthsData.forEach(month => {
      const monthData = generateMonth(year, month.id + 1);
      const daysCount = getDaysCount(year, month.id + 1);
      monthData.days = Array.from({ length: daysCount }, (_, day) => {
        const dayDate = new Date(Date.UTC(year, month.id, day + 1)).toISOString().split('T')[0];
        return {
          date: dayDate,
          ...isWorkingDay(year, month.id + 1, day + 1)
        };
      });
      const formattedMonthData = {
        year,
        month: {
          id: monthData.id,
          name: monthData.name,
          workingDays: monthData.workingDays,
          notWorkingDays: monthData.notWorkingDays,
          shortDays: monthData.shortDays,
          workingHours: monthData.workingHours
        },
        days: monthData.days,
        status: 200
      };
      fs.writeFileSync(path.join(yearDir, `${month.id + 1}.json`), JSON.stringify(formattedMonthData, null, 2));
    });

    const holidaysData = generateHolidays(year);
    fs.writeFileSync(path.join(yearDir, 'holidays.json'), JSON.stringify({ year, ...holidaysData, status: 200 }, null, 2));
  });

  console.log('Data generation completed successfully');
} catch (error) {
  console.error('Data generation failed:', error);
  process.exit(1); // Exit with a failure code
}
