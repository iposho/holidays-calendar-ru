const { marked } = require('marked');
const path = require('path');
const fs = require('fs');

const head = `
  <head>
    <title>Производственный календарь</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
`;

const styles = `
  <style>
    * {
      box-sizing: border-box;
    }
    body {
      padding: 30px 15px;
      font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,
      sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol;
      font-size: 1rem;
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
