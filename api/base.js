/**
 * Base class for the API classes
 */
const Api = require('../helpers/Api');
let theApi = null;

class BaseApi {
    constructor(config) {
        this.init(config);
        return this.setupEndpoints();
    }
    init(config) {
        theApi = new Api(config);
    }

    setupEndpoints() {
        return {
            logon() {
                return theApi.logon();
            }
        }
    }
    doCall(path, method, data, extraOptions) {
        return theApi.doCall(path, method, data, extraOptions);
    }
}

module.exports = BaseApi;
