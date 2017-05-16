const rp = require('request-promise');
const extend = require('util')._extend;

const baseUrl = "https://api.toonapi.com";
const apiBaseUrl = "/toon/api/v1";
const tokenPath = "/token";

class Api {
    constructor(config) {
        this.config = config;
        this.token = {};

        if (!this.config || !this.config.key || !this.config.secret || !this.config.username || !this.config.password) {
            console.error("credentials are missing");
        }
    }

    doCall(path, type, data, dataType, extraOptions) {

        let options = extend({
            uri: baseUrl + apiBaseUrl + path,
            method: type,
            body:  data ? data : undefined,
            headers: {
                'Authorization': 'Bearer ' + this.token.access_token,
                'Content-Type': 'application/json'
            },
            json: true // Automatically parses the JSON string in the response
        }, extraOptions);

        return rp(options);
    }

    post(path, data, dataType, extraOptions) {
        return this.doCall(path, 'POST', data, dataType, extraOptions);
    }

    put(path, data, dataType) {
        return this.doCall(path, 'PUT', data, dataType, extraOptions);
    }

    get(path, dataType, useCache) {
        return this.doCall(path, 'GET', undefined, dataType);
    }

    delete(path, dataType) {
        return this.doCall(path, 'DELETE', undefined, dataType);
    }

    getMerge(path, dataType) {
        return this.doCall(path, 'GET', undefined, dataType);
    }
    logon() {
        let postData = {
            'username': this.config.username,
            'password': this.config.password,
            'grant_type': 'password'
        };

        let options = {
            uri: baseUrl + tokenPath,
            form: postData,
            headers: {
                'Authorization': 'Basic ' + new Buffer(this.config.key + ":" + this.config.secret).toString('base64')
            }
        };

        let self = this;

        let action = this.post(tokenPath, postData, null, options);

        action.then(function (data) {
            self.token = data;
        }).catch(function (err) {
            console.log(err);
        });

        return action;
    }
}

module.exports = Api;
