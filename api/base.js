/**
 * Base class for the API classes
 */
const Api = require('../helpers/Api');
const Promise = require('promise');

class BaseApi {
    constructor(config) {
        this.init(config);
        return this.setupEndpoints();
    }
    init(config) {
        this.config = config;
        this.theApi = new Api(config);
        this.agreementId = null;
    }

    setupEndpoints() {
        let self = this;

        return {
            logon(logonData) {
                return self.theApi.logon(logonData);
            },
            token(token) {
                self.theApi.token = token;
                return this;
            },
            agreement(agreementId) {
                self.agreementId = agreementId;
                return this;
            }
        }
    }
    doCall(path, method, data, extraOptions) {
        if(!this.agreementId) {
            return Promise.reject(new Error('Agreement Id was not set','missing_agreement'));
        }
        if(!this.theApi.token || !this.theApi.token.access_token) {
            return Promise.reject(new Error('Token was not set','missing_token'));
        }

        return this.theApi.doCall(path, method, data, extraOptions);
    }
}

module.exports = BaseApi;
