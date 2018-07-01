const express = require('express');
const db = require('./db');
const Utils = require('./utils.js');
const router = express.Router();
const request = require('request');
const sequelize = db.sequelize;


router.get('/importData', async (req, res) => {
    request('https://data.sfgov.org/resource/wwmu-gmzc.json', async (error, response, body) => {
        body = JSON.parse(body);
        res.status(200).send('Data will be sortly imported. Process is running in background');
        let dataArray = Utils.mapDataForDB(body);
        let dataWithCooords = await Utils.addCoordsToData(dataArray);

        try {
            db.movies.bulkCreate(dataWithCooords)
        } catch (error) {
           res.status(500).send(error);
        }

    });
});

router.get('/autocomplete', async (req, res) => {
    try {
        const result = await db.movies.findAll({
            attributes: [[sequelize.fn('DISTINCT', sequelize.col('title')), 'title']],
            where: {
                'title': sequelize.where(sequelize.fn('LOWER', sequelize.col('title')), 'LIKE', '%' + req.query.term.toLowerCase() + '%'),
                'lat': {
                    $ne: null
                },
                'lng': {
                    $ne: null
                }

            }
        });
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/search', async (req, res) => {
    try {
        const result = await db.movies.findAll({
            where: {
                'title': req.query.title,
                'lat': {
                    $ne: null
                },
                'lng': {
                    $ne: null
                }
            }
        })
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;