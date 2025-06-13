const buildResponse = (status, message, data = null) => {
    const response = { status, message, timestamp: new Date().toISOString() };
    if (data !== null) response.data = data;
    return response;
};

const responseBuilder = {
    success: (res, message = 'Success', data = null, code = 200) => {
        return res.status(code).json(buildResponse('success', message, data));
    },

    created: (res, message = 'Resource created', data = null) => {
        return res.status(201).json(buildResponse('success', message, data));
    },

    error: (res, error, code = 500) => {
        const message =
            error && typeof error.message === 'string'
                ? error.message
                : 'Internal server error';
        return res.status(code).json(buildResponse('error', message));
    },
};

module.exports = responseBuilder;
