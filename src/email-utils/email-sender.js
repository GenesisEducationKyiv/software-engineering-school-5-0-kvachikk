const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const { Resend } = require('resend');
const config = require('../config/index');
const { isValidLetter } = require('../utils/email-validation');
const { fetchRawForecast } = require('../forecast/forecast-fetching');
const {
    groupForecastByDate,
    mapForecastToTemplate,
} = require('../forecast/forecast-handling');

const resend = new Resend(config.mailProvider.apiKey);

const sendTemplateLetter = async ({
    to,
    subject,
    templatePath,
    templateVars = {},
    text = '',
}) => {
    const fullPath = path.join(
        __dirname,
        '../constants/letters-templates',
        templatePath
    );
    const template = handlebars.compile(fs.readFileSync(fullPath, 'utf8'));
    const html = template(templateVars);

    const letter = {
        from: config.mailProvider.senderEmail,
        to,
        subject,
        html,
        text,
    };

    if (await isValidLetter(letter)) {
        await resend.emails.send({
            from: config.mailProvider.senderEmail,
            to: to,
            subject: subject,
            html: html,
        });
    }
};

const sendForecasts = async (subscriptions) => {
    for (const subscription of subscriptions) {
        const rawForecastList = await fetchRawForecast(subscription.city);
        if (!rawForecastList) {
            continue;
        }

        const groupedByDate = groupForecastByDate(rawForecastList);
        const formattedForecast = mapForecastToTemplate(groupedByDate);

        await sendTemplateLetter({
            to: subscription.email,
            subject: `Weather forecast for ${subscription.city}`,
            templatePath: 'weather-forecast.html',
            templateVars: {
                city: subscription.city,
                forecast: formattedForecast,
                unsubscribeUrl: `${config.baseUrl}/api/unsubscribe/${subscription.verificationToken}`,
            },
        });
    }
};

module.exports = {
    sendTemplateLetter,
    sendForecasts,
};
