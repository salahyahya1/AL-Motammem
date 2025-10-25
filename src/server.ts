import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine, isMainModule } from '@angular/ssr/node';
import express from 'express';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import bootstrap from './main.server';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');
const indexHtml = join(serverDistFolder, 'index.server.html');

const app = express();
const commonEngine = new CommonEngine();

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/**', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Serve static files from /browser
 */
// app.get(
//   '**',
//   express.static(browserDistFolder, {
//     maxAge: '1y',
//     index: 'index.html'
//   }),
// );
// 🟩 إعداد الكاش بناءً على نوع الملف
app.use(
  express.static(browserDistFolder, {
    setHeaders: (res, filePath) => {
      // لو الملف HTML (اللي SSR بيقدمه)
      if (filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=30');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
      } else if (
        /\.(?:js|css|mjs|map|webp|avif|png|jpg|jpeg|svg|gif|ico|woff2|woff|ttf)$/i.test(
          filePath
        )
      ) {
        // الملفات الثابتة
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      }
    },
  })
);


/**
 * Handle all other requests by rendering the Angular application.
 */
app.get('**', (req, res, next) => {
  const { protocol, originalUrl, baseUrl, headers } = req;

  commonEngine
    .render({
      bootstrap,
      documentFilePath: indexHtml,
      url: `${protocol}://${headers.host}${originalUrl}`,
      publicPath: browserDistFolder,
      providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
    })
    .then((html) => res.send(html))
    .catch((err) => next(err));
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

export default app;
