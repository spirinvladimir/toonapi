# Unofficial Toon API node package
       
With this package you can use the Toon Api more easily

## Prerequisites

You should have at least node & npm installed: <https://nodejs.org/en/download/>

## Initiate

Add to your package.json under dependencies:

```
"toonapi":"git://github.com/JacoKoster/toonapi.git"

//specific version:
"toonapi":"git://github.com/JacoKoster/toonapi.git#0.5.0"
```

## Getting agreements
```
Toon.token('<TOKEN>').agreements.get().then(function (data) {
    console.log(data);
}).catch(function() {
    console.log('Error getting agreements');
});

```

## Getting a device-list
```
Toon.token('<TOKEN>').agreement('<AGREEMENT_ID>').devices.get().then(function (data) {
    console.log(data);
}).catch(function() {
    console.log('Error getting status');
});
```

## Consumption / Production data & flows 
Several endpoints use dates for giving information about a specific time period. A normal date-object will be converted to a timestamp.
```
let consumptionRequest = { 
    interval: 'hours', 
    fromTime: new Date(), 
    toTime: new Date() 
}

Toon.token(token).agreement('<AGREEMENT_ID>').consumption.electricity.data(consumptionRequest).then(function (data) {
    console.log(data);
});
```
Also usable without any request info
```
Toon.token(token).agreement('<AGREEMENT_ID>').consumption.electricity.data().then(function (data) {
    console.log(data);
});
```

## Example with password grant (Development purposes only)
config.json
```
{
    client_id : '',
    client_secret : '',
    username : '',
    password : '',
    grant_type : 'password'
}
```

example.js
```
const ToonApi = require('toonapi');
const config = require('./config.json');

const Toon = new ToonApi('v1');

//Get the status of the display
Toon.logon(config).then(function (token) {
    return Toon.token(token).agreements.get().then(function (data) {

        let agreementId = data[0].agreementId;

        return Toon.agreement(agreementId).status.get().then(function (data) {
            console.log(data);
        }).catch(function() {
            console.log('Error getting status');
        });

    }).catch(function() {
        console.log('Error getting agreements');
    })
}).catch(function() {
    console.log('Error getting token');
});

```

## Example with Authorization grant

config.json
```
{
    client_id : '',
    client_secret : '',
    redirect_uri : 'http://localhost:3000/authEndpoint'
}
```

example.js
```
const express = require('express');
const app = express();

const ToonApi = require('toonapi');
const Toon = new ToonApi('v1');

const config = require('./config.json');

app.get('/', function (req, res) {
    res.send('Hello World! <br><br> <a href="/authorize">Authorize with the Toon Api</a>');
});

app.get('/authorize', function(req,res) {
    let response_type = 'code'

    res.redirect(`https://api.toonapi.com/authorize?response_type=${response_type}&redirect_uri=${config.redirect_uri}&client_id=${config.client_id}`);
});

app.get('/thanks', function(req, res) {
    res.send('Thanks!');
});

app.get('/authEndpoint', function(req, res) {
    res.redirect('/thanks');

    let authorizeConfig = {
        client_id : config.client_id,
        client_secret : config.client_secret,
        grant_type : 'authorization_code',
        redirect_uri : config.redirect_uri,
        code : req.query.code
    };
    Toon.logon(authorizeConfig).then(function (token) {
        console.log(token);

        //This would be a great moment to save the token for the corresponding user, so you can reuse it at any time. 

        Toon.token(token).agreements.get().then(function (data) {
            console.log(data)
        });

    });
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
```
## Example for refreshing a token
config.json
```
{
    client_id : '',
    client_secret : ''
}
```

example.js
```
const ToonApi = require('toonapi');
const config = require('./config.json');

const Toon = new ToonApi('v1');

//You have a token that is expired:
let token = {
                "access_token": "003ee108-dad6-3814",
                "refresh_token": "4d722b58-65cd-3d6c",
                "scope": "default",
                "token_type": "Bearer",
                "expires_in": 0
            }

let refreshConfig = {
    client_id : config.client_id,
    client_secret : config.client_secret,
    grant_type : 'refresh_token',
    refresh_token : token.refresh_token
};

//If refreshing doesn't work, the refresh-token is probably expired or the user has revoked access to your application. In that case you have to reauthorize
Toon.logon(refreshConfig).then(function (token) {
    console.log(token);
});

```
