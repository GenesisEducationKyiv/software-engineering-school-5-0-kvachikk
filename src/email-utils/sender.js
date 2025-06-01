const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const { isValidLetter } = require("./validation");

const transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE,
    auth: {
        user: process.env.SMTP_SENDER,
        pass: process.env.SMTP_PASSWORD,
    },
});

const sendTemplateLetter = async ({ to, subject, templatePath, templateVars = {}, text = "" }) => {
    const fullPath = path.join(__dirname, "../emails-templates", templatePath);
    const template = handlebars.compile(fs.readFileSync(fullPath, "utf8"));
    const html = template(templateVars);

    const letter = { from: process.env.SMTP_SENDER, to, subject, html, text };

    if (await isValidLetter(letter)) {
        try {
            await transporter.sendMail(letter);
        } catch (error) {
            throw new Error(`Failed to send email to ${to}: ${error.message}`);
        }
    }
};

module.exports = {
    sendTemplateLetter,
};
