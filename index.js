/**
 * Node wrapper for Toon API
 */
const V1 = require('./api/v1.js');
const V3 = require('./api/v3.js');

class ToonApi {
    constructor(version) {
        let config = {};
        config.debug = process.env.NODE_ENV === 'development';

        switch(version) {
            case 'v3':
                return new V3(config);
                break;
            case 'v1':
            default:
                return new V1(config);
                break;
        }
    }
}

module.exports = ToonApi;
