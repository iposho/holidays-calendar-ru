const { marked } = require('marked');
const path = require('path');
const fs = require('fs');

const head = `
  <head>
    <title>Производственный календарь</title>
  </head>
`;

const styles = `
  <style>
    body {
      padding: 30px 15px; font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,
      sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol;
    }
  </style>
`;

const createMainPage = (res) => {
  const readmePath = path.join(__dirname, '../README.md');
  const file = fs.readFileSync(readmePath, 'utf8');
  res.set('Content-Type', 'text/html');
  res.send(Buffer.from(head) + Buffer.from(styles) + marked(file.toString()));
};

module.exports = {
  createMainPage,
};
