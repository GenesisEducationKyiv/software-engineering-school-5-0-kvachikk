const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const {Resend} = require('resend');
const {isValidLetter} = require('./validation');

const resend = new Resend(process.env.MAIL_PROVIDER_API_KEY);

const sendTemplateLetter = async ({to, subject, templatePath, templateVars = {}, text = ''}) => {
    const fullPath = path.join(__dirname, '../emails-templates', templatePath);
    const template = handlebars.compile(fs.readFileSync(fullPath, 'utf8'));
    const html = template(templateVars);

    const letter = {from: process.env.MAIL_PROVIDER_SENDER_EMAIL, to, subject, html, text};

    if (await isValidLetter(letter)) {
        try {
            await resend.emails.send({
                from: process.env.MAIL_PROVIDER_SENDER_EMAIL,
                to: to,
                subject: subject,
                html: html
            });
        } catch (error) {
            throw new Error(`Failed to send email to ${to}: ${error.message}`);
        }
    }
};

module.exports = {
    sendTemplateLetter,
};
