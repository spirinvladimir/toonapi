const rp = require('request-promise');
const extend = require('util')._extend;

class Api {
    constructor(config) {
        this.config = config;
        this.token = {};

        if (!this.config || !this.config.key || !this.config.secret || !this.config.username || !this.config.password) {
            console.error("credentials are missing");
        }
    }

    doCall(path, method = 'GET', data, extraOptions = {}) {
        if(this.config.debug) {
            let debugData = typeof(data) === 'object' ? JSON.stringify(data) : data;

            console.log(`${method} : ${path} : ${debugData}`);
        }

        if(!this.token.access_token && path !== '/token') {
            console.error('You have not logged in to the API');
            return;
            //TODO: Add recovery for missing token?
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
                'Authorization': 'Bearer ' + this.token.access_token,
                'Content-Type': 'application/json'
            },
            json: true // Automatically parses the JSON string in the response
        }, extraOptions);

        return rp(options);
    }
    logon() {
        let randomStr = Math.random().toString(36).substr(2, 12);

        let postData = {
            'username': this.config.username,
            'password': this.config.password,
            'grant_type': 'password',
            'scope': 'device_' + randomStr
        };

        let options = {
            uri: this.config.baseUrl + this.config.tokenPath,
            form: postData,
            headers: {
                'Authorization': 'Basic ' + new Buffer(this.config.key + ":" + this.config.secret).toString('base64')
            }
        };

        let self = this;
        let action = this.doCall(this.config.tokenPath, 'POST', postData, options);

        action.then(function (data) {
            self.token = data;
        }).catch(function (err) {
            console.log(err);
        });

        return action;
    }
}

module.exports = Api;
