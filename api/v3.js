/**
 * ToonApi Node wrapper for API v3
 */
const extend = require('util')._extend;
const BaseApi = require('./base.js');

class V3 extends BaseApi {
    init(config) {
        config.baseUrl = 'https://api.toonapi.com';
        config.apiBaseUrl = '/toon/v3';
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
            status: {
                get() {
                    return self.doCall(`/${this.agreementId}/status`);
                }
            },
            consumption: {
                districtHeat: {
                    data(data) {
                        return self.doCall(`/${this.agreementId}/consumption/districtheat/data`, 'GET', data);
                    }
                },
                electricity: {
                    data(data) {
                        return self.doCall(`/${this.agreementId}/consumption/electricity/data`, 'GET', data);
                    },
                    flows(data) {
                        return self.doCall(`/${this.agreementId}/consumption/electricity/flows`,'GET', data);
                    }
                },
                gas: {
                    data(data) {
                        return self.doCall(`/${this.agreementId}/consumption/gas/data`, 'GET', data);
                    },
                    flows(data) {
                        return self.doCall(`/${this.agreementId}/consumption/gas/flows`, 'GET', data);
                    }
                }
            },
            devices(deviceUUID) {
                return {
                    get() {
                        if(deviceUUID) {
                            return self.doCall(`/${this.agreementId}/devices/${deviceUUID}`);
                        }
                        return self.doCall(`/${this.agreementId}/devices`);
                    },
                    set(data) {
                        if(deviceUUID) {
                            return self.doCall(`/${this.agreementId}/devices/${deviceUUID}`, 'PUT', data);
                        }
                        return self.doCall(`/${this.agreementId}/devices`,'PUT', data);
                    },
                    data(data) {
                        if(!deviceUUID) {
                            return Promise.reject(new Error('Device Id was not given','missing_deviceid'));
                        }
                        return self.doCall(`/${this.agreementId}/devices/${deviceUUID}/data`, 'GET', data);
                    },
                    flows(data) {
                        if(!deviceUUID) {
                            return Promise.reject(new Error('Device Id was not given','missing_deviceid'));
                        }
                        return self.doCall(`/${this.agreementId}/devices/${deviceUUID}/flows`, 'GET', data);
                    }

                };
            },
            production: {
                electricity: {
                    data(data) {
                        return self.doCall(`/${this.agreementId}/production/electricity/data`, 'GET', data);
                    },
                    delivery(data) {
                        return self.doCall(`/${this.agreementId}/production/electricity/delivery`,'GET', data);
                    },
                    flows(data) {
                        return self.doCall(`/${this.agreementId}/production/electricity/flows`,'GET', data);
                    }
                }
            },
            thermostat: {
                get() {
                    return self.doCall(`/${this.agreementId}/thermostat`);
                },
                update(data) {
                    return self.doCall(`/${this.agreementId}/thermostat`, 'PUT', data);
                },
                programs: {
                    get() {
                        return self.doCall(`/${this.agreementId}/thermostat/programs`);
                    },
                    update(data) {
                        return self.doCall(`/${this.agreementId}/thermostat/programs`, 'PUT', data);
                    }
                },
                states: {
                    get() {
                        return self.doCall(`/${this.agreementId}/thermostat/states`);
                    },
                    update(data) {
                        return self.doCall(`/${this.agreementId}/thermostat/states`, 'PUT', data);
                    }
                }
            },
            webhooks(webhookId) {
                return {
                    get() {
                        return self.doCall(`/${this.agreementId}/webhooks`);
                    },
                    create(data) {
                        return self.doCall(`/${this.agreementId}/webhooks`, 'POST', data);
                    },
                    delete() {
                        if (!webhookId) {
                            return Promise.reject(new Error('Webhook Id was not given','missing_webhookid'));
                        }
                        return self.doCall(`/${this.agreementId}/webhooks/${webhookId}`, 'DELETE');
                    }
                }
            }
        });
    }
}

module.exports = V3;
