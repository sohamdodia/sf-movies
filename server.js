const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./src/routes');
const config = require('./config');
const app = express();

//Enable Cors
app.use(cors());
app.options('*', cors());

//JSON parser
app.use(bodyParser.json());

//Server Routes
app.use('/', routes);

//Server Static Files
app.use(express.static('public'))

//Start Server
app.listen(config.const.apiPort, (error) => {
	if (error) {
		console.log('error', error);
	} else {
		console.log(`Application is runnig on ${config.const.apiPort}`);
	}
});