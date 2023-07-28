#!/bin/bash

# Run Cypress tests and generate Mochawesome report
npm run cy:run
npm run merge-and-generate

# Run the email-sending script
node send_report_email.js
