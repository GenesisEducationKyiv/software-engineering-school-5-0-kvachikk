const isValidEmail = async (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const isValidLetter = async ({from, to, subject, html, text}) => {
    if (!from || !await isValidEmail(from)) {
        throw new Error(`Invalid sender email address: "${from}"`);
    }
    if (!to || !await isValidEmail(to)) {
        throw new Error(`Invalid recipient email address: "${to}"`);
    }
    if (!subject || typeof subject !== 'string') {
        throw new Error('Subject is required and must be a string');
    }
    if (!html || typeof html !== 'string') {
        throw new Error('HTML content is required and must be a string');
    }
    if (text && typeof text !== 'string') {
        throw new Error('Text content is optional, but if provided, it must be a string');
    }
    return true;
};

module.exports = {
    isValidEmail,
    isValidLetter,
};