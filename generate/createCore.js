'use strict';

const request = require('request');
const yaml = require('js-yaml');
const fs = require('fs');

let data = {};
let search = {};
let social = {};
let other = {};
let mail = {};
let unknown = {};

//download 3 different files and combine them


const getSearch = () => {
    return new Promise((fulfill, reject) => {
        request('https://raw.githubusercontent.com/piwik/searchengine-and-social-list/master/SearchEngines.yml', (err, res, body) => {
            if (err) {
                reject(err);
            } else {
                search = body;
                fulfill();
            }
        });
    });
};

const getSocial = () => {
    return new Promise((fulfill, reject) => {
        request('https://raw.githubusercontent.com/piwik/searchengine-and-social-list/master/Socials.yml', (err, res, body) => {
            if (err) {
                reject(err);
            } else {
                social = body;
                fulfill();
            }
        });
    });
};

const getOther = () => {
    return new Promise((fulfill, reject) => {

        fs.readFile(__dirname + "/../data/snowplow.yml", (err, data) => {
            if (err) {
                reject(err);
            } else {
                other = data.toString();
                fulfill();
            }
        });

        // request('https://raw.githubusercontent.com/snowplow/referer-parser/master/resources/referers.yml', (err, res, body) => {
        // 		if (err) {
        // 			reject(err)
        // 		} else {
        // 			other = body;
        // 			fulfill();
        // 		}
        // });
    });
};

const combine = () => {

    //handle errors of YAML to JSON
    let otherJSON;
    try {
        otherJSON = yaml.safeLoad(other);
    } catch (e) {
        console.log(e);
    }

    try {
        data.search = yaml.safeLoad(search);
    } catch (e) {
        console.log(e);
    }

    try {
        data.social = yaml.safeLoad(social);
    } catch (e) {
        console.log(e);
    }

    data.uknown = otherJSON.unknown;
    data.email = otherJSON.email;

    //combine lists
    let found = false;
    for (let social in otherJSON.social) {
        found = false;
        for (let site in data.social) {
            if (social === site) {
                found = true;
            }
        }

        if (found === false) {
            data.social[social] = otherJSON.social[social];
        }
    }


    for (let search in otherJSON.search) {

        found = false;

        for (let site in data.search) {
            if (search === site) {
                found = true;
            }
        }

        if (found === false) {
            data.search[search] = otherJSON.search[search];
        }
    }
};


const refactor = () => {

    //remove 0 array from seach data to put at root

    for (let domain in data.search) {
        //facebook shouldn't be in search' 
        data.search[domain].urls = data.search[domain].domains;
        delete data.search[domain].domains;

        if (domain !== 'Facebook') {
            data.search[domain] = data.search[domain][0];
        } else {
            delete data.search[domain];
        }
    }

    //add urls object to social
    for (let domain in data.social) {
        if (!Array.isArray(data.social[domain])) {
            data.social[domain] = data.social[domain].domains;
        }

        data.social[domain] = {
            urls: data.social[domain]
        };
    }

    //change domains to urls
    for (let domain in data.uknown) {
        data.uknown[domain] = {
            urls: data.uknown[domain].domains
        };
    }

    //change domains to urls
    for (let domain in data.email) {
        data.email[domain] = {
            urls: data.email[domain].domains
        };
    }

    data.built = new Date();

    //Write to JSON File
    fs.writeFile(__dirname + '/../data/core.json', JSON.stringify(data));
    console.log('done');


};

getSearch()
    .then(getSearch)
    .then(getSocial)
    .then(getOther)
    .then(function() {

        combine();
        refactor();

    });