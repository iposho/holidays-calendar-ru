const fs = require('fs');
const path = require('path');

const ensureDirectoryExistence = (filePath) => {
  const dirname = path.dirname(filePath);

  if (fs.existsSync(dirname)) {
    return;
  }

  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
};

const requestsLogPath = path.join(__dirname, '../logs/requests.log');
const errorLogPath = path.join(__dirname, '../logs/error.log');

const addEntryToRequestsLog = (request) => {
  ensureDirectoryExistence(requestsLogPath);

  const timestamp = new Date();
  const { params, url } = request;
  const { day, month, year } = params;
  const string = `${timestamp.toString()}, path: ${url}, year: ${year}, month: ${month}, day: ${day}, status: 200\n`;

  fs.appendFileSync(requestsLogPath, string);
};

const addEntryToErrorLog = (request, { error, status }) => {
  ensureDirectoryExistence(errorLogPath);

  const timestamp = new Date();
  const { params, url } = request;
  const { day, month, year } = params;
  const string = `${timestamp.toString()}, error: ${error}, path: ${url}, year: ${year}, month: ${month}, day: ${day}, status: ${status}\n`;

  fs.appendFileSync(errorLogPath, string);
};

module.exports = {
  addEntryToRequestsLog,
  addEntryToErrorLog,
};
