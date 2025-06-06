class InvalidRequest extends Error {
    constructor(message) {
        super(message);
        this.name = 'Invalid Request';
        this.status = 400;
    }
}

module.exports = InvalidRequest;
