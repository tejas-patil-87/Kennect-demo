const nodemailer = require("nodemailer");
const fs = require("fs");
const configData = require("./config.json");
const emailConfig = configData;

// Email configuration
const transporter = nodemailer.createTransport({
  service: emailConfig.serviceProvider,
  auth: {
    user: emailConfig.senderEmailAddresser,
    pass: emailConfig.senderEmailPassword,
  },
});

// Function to send the email with the HTML report attached
function sendEmail() {
  const mailOptions = {
    from: emailConfig.senderEmailAddresser,
    to: emailConfig.recipientEmailAddresser,
    subject: emailConfig.subject,
    text: emailConfig.body,
    attachments: [
      {
        filename: "merged-report.html",
        content: fs.readFileSync("cypress/reports/merged-report.html", "utf-8"),
      },
    ],
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
}

// Call the function to send the email
sendEmail();
