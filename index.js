const express = require('express');
const config = require('./src/config');
const loaders = require('./src/loaders');

async function runServer() {
    const app = express();

    try {
        await loaders.init({ expressApp: app });

        app.listen(config.port, () => {
            console.log(`Server listening on port: ${config.port}`);
        });
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

runServer();
