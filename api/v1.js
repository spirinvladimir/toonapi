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
                },
                select(data) {
                    return self.doCall('/agreements', 'POST', data);
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
                            console.error('This functionality is not available');
                            return;
                        }
                        return self.doCall(`/devices/${deviceUUID}/data`, 'GET', data);
                    },
                    flows(data) {
                        if(!deviceUUID) {
                            console.error('This functionality is not available');
                            return;
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
}

module.exports = V1;
