const nodemailer = require("nodemailer");
const { execSync } = require("child_process");

const environment = process.env.ENVIRONMENT || "development";
const fromEmail = process.env.FROM_EMAIL;
const toEmail = process.env.TO_EMAIL.split(",");
const subject = `APK Orbitta - ${environment.toUpperCase()}`;
const emailPassword = process.env.GMAIL_PASSWORD;
const downloadLink = process.argv[2];

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: fromEmail,
    pass: emailPassword,
  },
});

function getRecentCommits() {
  try {
    return execSync('git log -n 5 --pretty=format:"%h - %s (%an, %cd)" --date=format:%d/%m/%Y --no-merges').toString();
  } catch (error) {
    console.error("Error getting commit messages:", error.message);
    return error.message;
  }
}

const url = environment === "development" ? "https://orbitta-development.web.app" : environment === "homolog" ? "https://orbitta-homolog.web.app" : "https://orbitta-production.web.app";
const buildNumber = process.env.BITBUCKET_BUILD_NUMBER;

const recentCommits = getRecentCommits();
const mailOptions = {
  from: fromEmail,
  to: toEmail.map((email) => email.trim()),
  subject: subject,
  html: `
    Ambiente <b>Orbitta ${environment.toUpperCase()}</b>(build <b>${buildNumber}</b>) foi atualizado!<br/><br/>
    APK: ${downloadLink}<br/><br/>
    URL: ${url}<br/><br/><br/>
    Últimos commits:<br/>
    <pre>${recentCommits}</pre>
  `,
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error("Error sending email:", error.message);
    process.exit(1);
  } else {
    
    process.exit(0);
  }
});
