const { marked } = require('marked');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

const env = process.env.NODE_ENV || 'development';
const envFile = env === 'production' ? '.env' : '.env.local';
dotenv.config({ path: envFile });

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
`;

const yandexMetrikaId = process.env.YANDEX_METRIKA_ID;
const yandexMetrika = yandexMetrikaId
  ? `
    <script type="text/javascript">
      (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
      m[i].l=1*new Date();
      for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
      k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
      (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

      ym(${yandexMetrikaId}, "init", {
        clickmap:true,
        trackLinks:true,
        accurateTrackBounce:true
      });
    </script>
    <noscript>
      <div>
        <img src="https://mc.yandex.ru/watch/97168303" style="position:absolute; left:-9999px;" alt="" />
      </div>
    </noscript>
  `
  : '';

const createMainPage = (res) => {
  const readmePath = path.join(__dirname, '../README.md');
  const file = fs.readFileSync(readmePath, 'utf8');
  res.set('Content-Type', 'text/html');
  res.send(
    Buffer.from(head)
    + Buffer.from(styles)
    + marked(file.toString())
    + Buffer.from(yandexMetrika),
  );
};

module.exports = {
  createMainPage,
};
