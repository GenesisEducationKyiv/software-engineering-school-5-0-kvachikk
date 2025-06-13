const messages = require('../constants/messages/validation-messages');

const isValidEmail = async (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const isValidLetter = async ({ from, to, subject, html, text }) => {
    if (!from || !(await isValidEmail(from))) {
        throw new Error(`${messages.LETTER_SENDER_INVALID}"${from}"`);
    }
    if (!to || !(await isValidEmail(to))) {
        throw new Error(`${messages.LETTER_RECIPIENT_INVALID}"${to}"`);
    }
    if (!subject || typeof subject !== 'string') {
        throw new Error(messages.LETTER_SUBJECT_REQUIRED);
    }
    if (!html || typeof html !== 'string') {
        throw new Error(messages.LETTER_HTML_REQUIRED);
    }
    if (text && typeof text !== 'string') {
        throw new Error(messages.LETTER_TEXT_INVALID);
    }
    return true;
};

module.exports = {
    isValidEmail,
    isValidLetter,
};
