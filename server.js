const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const puppeteer = require('puppeteer');
const generateResumeHTML = require('./resumeTemplate');
import { SpeedInsights } from "@vercel/speed-insights/next"

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/generate-pdf', async (req, res) => {
  const html = generateResumeHTML(req.body);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });

  const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
  await browser.close();

  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'attachment; filename=resume.pdf',
  });

  res.send(pdfBuffer);
});

app.listen(5000, () => {
  console.log('Server running at http://localhost:5000');
});
