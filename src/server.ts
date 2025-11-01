
import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine, isMainModule } from '@angular/ssr/node';
import express from 'express';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import compression from 'compression';
import bootstrap from './main.server.js';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');
const indexHtml = join(serverDistFolder, 'index.server.html');

const app = express();
const commonEngine = new CommonEngine();

app.use(compression());

app.use(
  express.static(browserDistFolder, {
    index: false,
    setHeaders: (res, filePath) => {
      if (/\.(js|mjs)$/i.test(filePath)) res.type('application/javascript');
      else if (/\.css$/i.test(filePath)) res.type('text/css');
      else if (/\.json$/i.test(filePath)) res.type('application/json');
      else if (/\.html$/i.test(filePath)) res.type('text/html');

      // تفعيل الكاش القوي للملفات الثابتة
      if (/\.(?:js|css|mjs|map|webp|avif|png|jpg|jpeg|svg|gif|ico|woff2|woff|ttf)$/i.test(filePath)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      } else if (filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      }
    },
  })
);
// app.use(
//   express.static(browserDistFolder, {
//     index: false,
//     setHeaders: (res, filePath) => {
//       if (/\.(?:html)$/i.test(filePath)) {
//         // الـ HTML لازم يتحدث دايمًا
//         res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
//       } else {
//         // باقي الملفات (js, css, صور...) تتخزن في الكاش لمدة سنة
//         res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
//       }
//     },
//   })
// );

// ✅ 2. تأكد أن أي طلب للـ JS/CSS يتعامل كسيرفر ستاتيك مش SSR
app.get(/\.(js|mjs|css|ico|png|jpg|jpeg|webp|svg|gif|woff2|woff|ttf)$/i, (req, res, next) => {
  const filePath = join(browserDistFolder, req.path);
  res.sendFile(filePath, (err) => {
    if (err) next();
  });
});

// ✅ 3. الـ SSR نفسه لأي طلب آخر
app.get('*', (req, res, next) => {
  commonEngine
    .render({
      bootstrap,
      documentFilePath: indexHtml,
      url: req.originalUrl,
      publicPath: browserDistFolder,
      providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }],
    })
    .then((html) => res.send(html))
    .catch((err) => next(err));
});

// ✅ 4. تشغيل السيرفر
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`✅ Angular SSR running on http://localhost:${port}`);
    console.log(`📁 Serving static from: ${browserDistFolder}`);
  });
}

export default app;
