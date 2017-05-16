# Unofficial Toon API node package
       
With this package you can use the Toon Api more easily

## Prerequisites

You should have at least node & npm installed: <https://nodejs.org/en/download/>

## Initiate

Add to your package.json under dependencies:

```
"toonapi":"git://github.com/JacoKoster/toonapi.git"

//specific version:
"toonapi":"git://github.com/JacoKoster/toonapi.git#0.1.0"
```

## Create a config.json

```
{
    "key": "",
    "secret": "",
    "username": "",
    "password": ""
}
```

## Start using it:

```
const Promise = require('promise');
const ToonApi = require('toonapi');
const config = require('./config.json');

const Toon = new ToonApi(config);

let logonPromise = new Promise(function (resolve, reject) {
    Toon.logon().then(function() {
        Toon.agreements().get().then(function(data) {

            let agreement = {
                agreementId : data[0].agreementId
            };

            Toon.agreements().select(agreement).then(function() {
                resolve();
            });
        });
    });
});

logonPromise.then(function() {
    console.log('start doing all the things!');

    let loop = function() {
        Toon.status().get().then(function (data) {
            console.log(data);
        });
    };

    setInterval(loop, 1000);
});

```
