import puppeteer from 'puppeteer';

async function createPDF(hostname, id) {
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
  const page = await browser.newPage();
  await page.goto(`http://${hostname}/download-report?id=${id}`, {
    waitUntil: 'networkidle0',
  });
  const pdf = await page.pdf({
    format: 'A4',
    margin: { top: 20, left: 25.4, bottom: 20, right: 25.4 },
  });
  await browser.close();
  return pdf;
}

async function handler(req, res) {
  await createPDF(req.headers.host, req.query.id).then((pdf) => {
    res.send(pdf);
  });
}

export default handler;
