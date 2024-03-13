import puppeteer from 'puppeteer';
import { getToken } from 'next-auth/jwt';

async function createPDF(hostname, id, id_token) {
  const browser = await puppeteer.launch(
    process.env['NODE_ENV'] !== 'production'
      ? {
          headless: 'new',
          args: ['--no-sandbox'],
        }
      : {
          headless: true,
          executablePath: '/usr/bin/chromium-browser',
          args: [
            '--no-sandbox',
            '--headless',
            '--disable-gpu',
            '--disable-dev-shm-usage',
          ],
        }
  );
  const protocol = hostname.indexOf('localhost') === 0 ? 'http' : 'https';
  const baseUrl =
    process.env['NODE_ENV'] === 'production' ? '/export-annex-VII-waste' : '';
  const page = await browser.newPage();
  await page.goto(
    `${protocol}://${hostname}${baseUrl}/pdf?id=${id}&token=${id_token}`,
    {
      waitUntil: 'networkidle0',
    }
  );
  const pdf = await page.pdf({
    format: 'A4',
    margin: { top: 20, left: 25.4, bottom: 20, right: 25.4 },
  });
  await browser.close();
  return pdf;
}

async function handler(req, res) {
  const token = await getToken({ req });
  await createPDF(req.headers.host, req.query.id, token.id_token).then(
    (pdf) => {
      res.send(pdf);
    }
  );
}

export default handler;
