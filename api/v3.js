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
            display(agreementId) {
                if(!agreementId) {
                    console.error('AgreementId is missing');
                    return;
                }

                return {
                    status: {
                        get() {
                            return self.doCall(`/${agreementId}/status`);
                        }
                    },
                    consumption: {
                        districtHeat: {
                            data(data) {
                                return self.doCall(`/${agreementId}/consumption/districtheat/data`, 'GET', data);
                            }
                        },
                        electricity: {
                            data(data) {
                                return self.doCall(`/${agreementId}/consumption/electricity/data`, 'GET', data);
                            },
                            flows(data) {
                                return self.doCall(`/${agreementId}/consumption/electricity/flows`,'GET', data);
                            }
                        },
                        gas: {
                            data(data) {
                                return self.doCall(`/${agreementId}/consumption/gas/data`, 'GET', data);
                            },
                            flows(data) {
                                return self.doCall(`/${agreementId}/consumption/gas/flows`, 'GET', data);
                            }
                        }
                    },
                    devices(deviceUUID) {
                        return {
                            get() {
                                if(deviceUUID) {
                                    return self.doCall(`/${agreementId}/devices/${deviceUUID}`);
                                }
                                return self.doCall(`/${agreementId}/devices`);
                            },
                            set(data) {
                                if(deviceUUID) {
                                    return self.doCall(`/${agreementId}/devices/${deviceUUID}`, 'PUT', data);
                                }
                                return self.doCall(`/${agreementId}/devices`,'PUT', data);
                            },
                            data(data) {
                                if(!deviceUUID) {
                                    console.error('The devideUUID is missing');
                                    return;
                                }
                                return self.doCall(`/${agreementId}/devices/${deviceUUID}/data`, 'GET', data);
                            },
                            flows(data) {
                                if(!deviceUUID) {
                                    console.error('The devideUUID is missing');
                                    return;
                                }
                                return self.doCall(`/${agreementId}/devices/${deviceUUID}/flows`, 'GET', data);
                            }

                        };
                    },
                    production: {
                        electricity: {
                            data(data) {
                                return self.doCall(`/${agreementId}/production/electricity/data`, 'GET', data);
                            },
                            delivery(data) {
                                return self.doCall(`/${agreementId}/production/electricity/delivery`,'GET', data);
                            },
                            flows(data) {
                                return self.doCall(`/${agreementId}/production/electricity/flows`,'GET', data);
                            }
                        }
                    },
                    thermostat: {
                        get() {
                            return self.doCall(`/${agreementId}/thermostat`);
                        },
                        update(data) {
                            return self.doCall(`/${agreementId}/thermostat`, 'PUT', data);
                        },
                        programs: {
                            get() {
                                return self.doCall(`/${agreementId}/thermostat/programs`);
                            },
                            update(data) {
                                return self.doCall(`/${agreementId}/thermostat/programs`, 'PUT', data);
                            }
                        },
                        states: {
                            get() {
                                return self.doCall(`/${agreementId}/thermostat/states`);
                            },
                            update(data) {
                                return self.doCall(`/${agreementId}/thermostat/states`, 'PUT', data);
                            }
                        }
                    },
                    webhooks(webhookId) {
                        return {
                            get() {
                                return self.doCall(`/${agreementId}/webhooks`);
                            },
                            create(data) {
                                return self.doCall(`/${agreementId}/webhooks`, 'POST', data);
                            },
                            delete() {
                                if(!webhookId) {
                                    console.error('The webhookid is missing');
                                    return;
                                }
                                return self.doCall(`/${agreementId}/webhooks/${webhookId}`, 'DELETE');
                            }
                        }
                    }
                }
            }
        });
    }
}

module.exports = V3;
