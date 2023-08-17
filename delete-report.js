const fs = require('fs');
const path = require('path');

const reportPath = path.join(__dirname, 'cypress', 'reports');

if (fs.existsSync(reportPath)) {
  fs.rmdirSync(reportPath, { recursive: true });
  console.log('Existing report directory deleted.');
} else {
  console.log('No existing report directory found.');
}
