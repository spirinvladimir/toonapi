import test from 'ava';
import Api from '../helpers/Api';

test('validateLogonData', t => {
    const api = new Api();

	t.deepEqual(api.validateLogonData(), "The logon object is required");
	t.deepEqual(api.validateLogonData({}), "A client key is required");
});
