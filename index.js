/**
 * ToonApi Node wrapper for API v1
 */
const Api = require('./helpers/Api');
const theApi = null;

class ToonApi {
    constructor(config) {
        theApi = new Api(config);
    }

    logon() {
        return theApi.logon();
    }

    agreements() {
        return {
            get() {
                return theApi.get('/agreements', undefined, true);
            },
            select(data) {
                return theApi.post('/agreements', data, 'text');
            }
        };
    }
    status() {
        return {
            getComplete() {
                return theApi.getMerge('/status');
            },
            get() {
                return theApi.get('/status');
            }
        }
    };
    temperature() {
        return {
            get() {
                return theApi.get('/temperature');
            },
            update(data) {
                return theApi.put('/temperature', data, 'text');
            },
            programs: {
                get() {
                    return theApi.get('/temperature/programs');
                },
                create(data) {
                    return theApi.post('/temperature/programs', data);
                },
                update(data) {
                    return theApi.put('/temperature/programs', data);
                },
                delete(programId) {
                    return theApi.delete(`/temperature/programs/${programId}`);
                }
            },
            states: {
                get() {
                    return theApi.get('/temperature/states');
                },
                update(data) {
                    return theApi.put('/temperature/states', data, 'text');
                }
            }
        }
    };
    consumption() {
        return {
            districtHeat: {
                data(interval, from, to) {
                    let qs = {};
                    if (interval) qs.interval = interval;
                    if (from) qs.fromTime = from.getTime();
                    if (to) qs.toTime = to.getTime();
                    return theApi.get('/consumption/districtheat/data', undefined, undefined, {qs: qs});
                }
            },
            electricity: {
                data(interval, from, to) {
                    let qs = {};
                    if (interval) qs.interval = interval;
                    if (from) qs.fromTime = from.getTime();
                    if (to) qs.toTime = to.getTime();
                    return theApi.get('/consumption/electricity/data', undefined, undefined, {qs: qs});
                },
                flows(interval, from, to) {
                    let qs = {};
                    if (interval) qs.interval = interval;
                    if (from) qs.fromTime = from.getTime();
                    if (to) qs.toTime = to.getTime();
                    return theApi.get('/consumption/electricity/flows', undefined, undefined, {qs: qs});
                }
            },
            gas: {
                data(interval, from, to) {
                    let qs = {};
                    if (interval) qs.interval = interval;
                    if (from) qs.fromTime = from.getTime();
                    if (to) qs.toTime = to.getTime();
                    return theApi.get('/consumption/gas/data', undefined, undefined, {qs: qs});
                },
                flows(interval, from, to) {
                    let qs = {};
                    if (interval) qs.interval = interval;
                    if (from) qs.fromTime = from.getTime();
                    if (to) qs.toTime = to.getTime();
                    return theApi.get('/consumption/gas/flows', undefined, undefined, {qs: qs});
                }
            }
        }
    };
    devices() {
        return {
            get() {
                return theApi.get('/devices');
            },
            update(data) {
                return theApi.put('/devices', data);
            }
        }
    };
    device() {
        return {
            get(deviceUUID){
                return theApi.get(`/devices/${deviceUUID}`);
            },
            update(deviceUUID, data) {
                return theApi.put(`/devices/${deviceUUID}`, data);
            },
            data(deviceUUID) {
                return theApi.get(`/devices/${deviceUUID}/data`);
            },
            flows(deviceUUID) {
                return theApi.get(`/devices/${deviceUUID}/flows`);
            }
        }
    }
}

module.exports = ToonApi;
