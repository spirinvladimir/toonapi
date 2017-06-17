const rp = require('request-promise');
const Promise = require('promise');
const extend = require('util')._extend;

class Api {
    constructor(config) {
        this.config = config;
    }

    doCall(path, method = 'GET', data, extraOptions = {}) {
        if(this.config.debug) {
            let debugData = typeof(data) === 'object' ? JSON.stringify(data) : data;

            console.log(`${method} : ${path} : ${debugData}`);
        }

        if(path !== '/token' && (!this.token || !this.token.access_token)) {
            return Promise.reject(new Error('Missing Token','missing_token'));
        } else if(this.token && this.token.access_token) {
            extraOptions.headers = {
                'Authorization': 'Bearer ' + this.token.access_token,
            }
        }

        if(method === 'GET' && typeof(data) === 'object') {
            Object.keys(data).forEach(function(key) {
                if(typeof(data[key].getTime) === 'function') {
                    data[key] = data[key].getTime();
                }
            });
            extraOptions.qs = data;
        }

        let options = extend({
            uri: this.config.baseUrl + this.config.apiBaseUrl + path,
            method: method,
            body:  data ? data : undefined,
            headers: {
                'Content-Type': 'application/json'
            },
            json: true // Automatically parses the JSON string in the response
        }, extraOptions);

        return rp(options);
    }
    logon(logonData) {
        let validationResult = this.validateLogonData(logonData);

        if(validationResult) {
            return Promise.reject(new Error(validationResult));
        }

        let randomStr = Math.random().toString(36).substr(2, 12);

        let postData = extend({
            'scope': 'device_' + randomStr
        }, logonData);

        let options = {
            uri: this.config.baseUrl + this.config.tokenPath,
            form: postData
        };

        return this.doCall(this.config.tokenPath, 'POST', postData, options);
    }
    validateLogonData(data) {
        if(!data) {
            return "The logon object is required";
        }
        if(!data.client_id) {
            return "A client key is required";
        }
        if(!data.client_secret) {
            return "A client secret is required";
        }
        if(!data.grant_type) {
            return "A grant_type is required, this can be 'authorization_code', 'password' or 'refresh_token'";
        }
        if(data.grant_type === 'password') {
            console.warn('Grant type Password should only be used for development purposes!');
            if(!data.username) {
                return "A username is required";
            }
            if(!data.password) {
                return "A password is required";
            }
            return false;
        }

        if(data.grant_type === 'authorization_code') {
            if(!data.code) {
                return "A authorizationcode is required";
            }
            if(!data.redirect_uri) {
                return "A redirect uri is required";
            }
        }
        if(data.grant_type === 'refresh_token') {
            if(!data.refresh_token) {
                return "A refresh_token is required";
            }
        }

        return false;
    }

}

module.exports = Api;
