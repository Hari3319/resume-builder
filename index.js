// backend/index.js

const express = require('express');
const bodyParser = require('body-parser');
const path = 'path';
const ejs = require('ejs');
const puppeteer = require('puppeteer-core');
const chrome = require('chrome-aws-lambda');

const app = express();

// Use middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../frontend'))); // Serve frontend files

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// The main route to generate the PDF
app.post('/api/resume', async (req, res) => {
    try {
        // 1. Generate HTML content from the EJS template and request data
        const html = await ejs.renderFile(path.join(__dirname, 'views', 'resume.ejs'), {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            linkedin: req.body.linkedin,
            github: req.body.github,
            skills: req.body.skills,
            exp1_title: req.body.exp1_title,
            exp1_org: req.body.exp1_org,
            exp1_dur: req.body.exp1_dur,
            exp1_desc: req.body.exp1_desc,
            exp2_title: req.body.exp2_title,
            exp2_org: req.body.exp2_org,
            exp2_dur: req.body.exp2_dur,
            exp2_desc: req.body.exp2_desc,
            proj1_title: req.body.proj1_title,
            proj1_link: req.body.proj1_link,
            proj1_desc: req.body.proj1_desc,
            proj2_title: req.body.proj2_title,
            proj2_link: req.body.proj2_link,
            proj2_desc: req.body.proj2_desc,
            edu_school: req.body.edu_school,
            edu_year: req.body.edu_year,
            edu_qualification: req.body.edu_qualification,
            edu_desc: req.body.edu_desc,
            extra_1: req.body.extra_1,
            extra_2: req.body.extra_2,
        });

        // 2. Launch Puppeteer with the correct settings for Vercel
        const browser = await puppeteer.launch({
            args: chrome.args,
            executablePath: await chrome.executablePath,
            headless: chrome.headless,
        });
        const page = await browser.newPage();

        // 3. Set the HTML content and generate the PDF
        await page.setContent(html, { waitUntil: 'networkidle0' });
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true, // Important for styling
        });

        await browser.close();

        // 4. Send the generated PDF back to the client
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=resume.pdf');
        res.send(pdfBuffer);

    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).send('An error occurred while generating the PDF.');
    }
});

// A simple route to serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app; // Export for Vercel
