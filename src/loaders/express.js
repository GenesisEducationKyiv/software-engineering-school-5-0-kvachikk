const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const swaggerDocument = YAML.load('./swagger.yaml');

const expressLoader = ({ app, services }) => {
    app.use(cors());
    app.use(helmet());
    app.use(morgan('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    const routes = require('../routes/index')(services);
    app.use('/api', routes);
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    app.use(express.static(path.join(__dirname, '../../public')));

    app.use((err, req, res, next) => {
        if (res.headersSent) {
            return next(err);
        }

        return res.status(err.status).json({ error: err.message });
    });

    console.log('Express loaded');
    return app;
};

module.exports = expressLoader;
