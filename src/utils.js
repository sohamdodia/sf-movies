const config = require('../config');
const googleMapsClient = require('@google/maps').createClient({
    key: config.const.geoLocationAPIKey
});


const dbMapping = {
    actor1: 'actor_1',
    actor2: 'actor_2',
    actor3: 'actor_3',
    director: 'director',
    distributor: 'distributor',
    funFacts: 'fun_facts',
    locations: 'locations',
    productionCompany: 'production_company',
    releaseYear: 'release_year',
    title: 'title',
    writer: 'writer'
}

const requestsPerSecond = 50;

const mapDataForDB = body => {
    let dataArray = [];
    for (let i = 0; i < body.length; i++) {
        let data = body[i];
        let dataToBeInserted = {};
        Object.keys(dbMapping).forEach((key) => {
            dataToBeInserted[key] = data[dbMapping[key]];
        });
        dataArray.push(dataToBeInserted);
    }
    return dataArray;
};

const sleep = async (time = 0) => new Promise (res => setTimeout(res(), time));

const getCoords = async address => {
    return new Promise (res => {
        googleMapsClient.geocode({
            address: address + ', San Francisco'
        }, (err, response) => {
            if (!err) {
                const results = response.json.results;
                if (results && results[0]) {
                    const location = results[0].geometry.location;

                    res(location);
                } else {
                    res();
                }
            } else {
                console.log('error', err);
                res();
            }
        });
    });
};

const addCoordsToData = async mappedData => {
    let finalData = [];

    while (mappedData.length > 0) {
        let batch = mappedData.splice(0, requestsPerSecond);

        for (let i = 0; i < batch.length; i++) {
            let location = {};
            if (batch[i].locations) {
                location = (await getCoords(batch[i].locations)) || {};
            }
            batch[i].lat = location.lat || null;
            batch[i].lng = location.lng || null;
        }

        finalData = finalData.concat(batch);

        await sleep(1000);        
    }

    return finalData;
};

module.exports = {
    mapDataForDB,
    addCoordsToData
};
