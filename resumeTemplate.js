module.exports = function generateResumeHTML(data) {
  return `
  <html>
  <head>
    <style>
      body { font-family: Arial, sans-serif; margin: 40px; color: #000; }
      h1 { font-size: 24px; margin-bottom: 4px; }
      h2 { font-size: 18px; margin-top: 24px; border-bottom: 1px solid #aaa; }
      .section { margin-bottom: 16px; }
      ul { padding-left: 20px; }
      li { margin-bottom: 4px; }
      .contact { font-size: 14px; color: #333; }
      .bold { font-weight: bold; }
    </style>
  </head>
  <body>
    <h1>${data.name}</h1>
    <div class="contact">${data.location} | ${data.phone} | ${data.email}</div>

    <h2>Summary</h2>
    <div class="section">${data.summary}</div>

    <h2>Skills</h2>
    <div class="section"><ul>${data.skills.split(',').map(skill => `<li>${skill.trim()}</li>`).join('')}</ul></div>

    <h2>Experience</h2>
    <div class="section">${data.experience.replace(/\n/g, "<br/>")}</div>

    <h2>Education and Training</h2>
    <div class="section">${data.education.replace(/\n/g, "<br/>")}</div>

    <h2>Languages</h2>
    <div class="section">${data.languages.replace(/\n/g, "<br/>")}</div>
  </body>
  </html>
  `;
}
