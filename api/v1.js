/**
 * ToonApi Node wrapper for API v1
 */
const extend = require('util')._extend;
const BaseApi = require('./base.js');

class V1 extends BaseApi {
    init(config) {
        config.baseUrl = 'https://api.toonapi.com';
        config.apiBaseUrl = '/toon/api/v1';
        config.tokenPath = '/token';
        super.init(config);
    }

    setupEndpoints() {
        let self = this;
        let endpoints = super.setupEndpoints();

        return extend(endpoints, {
            agreements: {
                get() {
                    return self.doCall('/agreements');
                }
            },
            consumption: {
                districtHeat: {
                    data(data) {
                        return self.doCall('/consumption/districtheat/data', 'GET', data);
                    }
                },
                electricity: {
                    data(data) {
                        return self.doCall('/consumption/electricity/data', 'GET', data);
                    },
                    flows(data) {
                        return self.doCall('/consumption/electricity/flows','GET', data);
                    }
                },
                gas: {
                    data(data) {
                        return self.doCall('/consumption/gas/data', 'GET', data);
                    },
                    flows(data) {
                        return self.doCall('/consumption/gas/flows', 'GET', data);
                    }
                }
            },
            devices(deviceUUID) {
                return {
                    get() {
                        if(deviceUUID) {
                            return self.doCall(`/devices/${deviceUUID}`);
                        }
                        return self.doCall('/devices');
                    },
                    set(data) {
                        if(deviceUUID) {
                            return self.doCall(`/devices/${deviceUUID}`, 'PUT', data);
                        }
                        return self.doCall('/devices','PUT', data);
                    },
                    data(data) {
                        if(!deviceUUID) {
                            return Promise.reject(new Error('Device Id was not given','missing_deviceid'));
                        }
                        return self.doCall(`/devices/${deviceUUID}/data`, 'GET', data);
                    },
                    flows(data) {
                        if(!deviceUUID) {
                            return Promise.reject(new Error('Device Id was not given','missing_deviceid'));
                        }
                        return self.doCall(`/devices/${deviceUUID}/flows`, 'GET', data);
                    }

                };
            },
            status: {
                get() {
                    return self.doCall('/status');
                }
            },
            temperature: {
                get() {
                    return self.doCall('/temperature');
                },
                set(data) {
                    return self.doCall('/temperature', 'PUT', data);
                },
                programs: {
                    get() {
                        return self.doCall('/temperature/programs');
                    }
                },
                states: {
                    get() {
                        return self.doCall('/temperature/states');
                    },
                    set(data) {
                        return self.doCall('/temperature/states', 'PUT', data);
                    }
                }
            }

        });
    }

    /**
     * Overrides the base functionality to make the post agreement thing transparent.
     * @param path
     * @param method
     * @param data
     * @param extraOptions
     * @override BaseApi
     * @returns Promise
     */
    doCall(path, method, data, extraOptions) {
        if(path !== '/agreements' && !this.agreementId) {
            return Promise.reject(new Error('Agreement Id was not set','missing_agreement'));
        }
        if(!this.theApi.token || !this.theApi.token.access_token) {
            return Promise.reject(new Error('Token was not set','missing_token'));
        }
        let self = this;

        return new Promise(function (resolve, reject) {
            self.theApi.doCall(path, method, data, extraOptions).then(resolve).catch(function(error) {

                if(error.error.message === 'Unable to get common name for the device by the provided customer id.') {

                    if(self.config.debug) {
                        console.log('ToonApi: API forgot what display we were talking to, sending a reminder');
                    }

                    let agreementObject = {
                            agreementId: self.agreementId
                    };

                    //post the agreement
                    return self.theApi.doCall('/agreements', 'POST', agreementObject).then(function() {
                        //retry the original call
                        return self.doCall(path, method, data, extraOptions).then(resolve).catch(reject);
                    }).catch(reject)
                } else {
                    return reject(error);
                }
            });

        });
    }
}

module.exports = V1;
