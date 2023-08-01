const { marked } = require('marked');
const path = require('path');
const fs = require('fs');

const createMainPage = (res) => {
  const readmePath = path.join(__dirname, '../README.md');

  fs.readFile(readmePath, 'utf8', (err, file) => {
    if (err) {
      // Handle error, e.g., send an error response
      res.status(500).send('Error reading README.md');
      return;
    }

    const head = `
      <head>
        <title>Производственный календарь</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>
          * {
            box-sizing: border-box;
          }
          html {
            font-size: 16px;
          }
          body {
            padding: 30px 15px;
            font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,
            sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol;
            font-size: 1rem;
            margin: 0;
          }
          pre {
            display: flex;
            overflow-x: auto;
          }
          .language-bash {
            padding: 15px 0;
          }
        </style>
      </head>
    `;

    const content = marked(file.toString());

    const html = `
      <!DOCTYPE html>
      <html lang="ru">
        ${head}
        <body>
          ${content}
        </body>
      </html>
    `;

    res.set('Content-Type', 'text/html');
    res.send(html);
  });
};

module.exports = {
  createMainPage,
};
