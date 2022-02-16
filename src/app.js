require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const bodyParser = require('body-parser')
const cors = require('cors');


const middlewares = require('./middlewares');
const api = require('./api');

const app = express();

app.set('view engine', 'ejs');

app.use(morgan('dev'));
app.use(helmet.dnsPrefetchControl());
app.use(helmet.expectCt());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());
app.use(helmet.hsts());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.originAgentCluster());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());
app.use(cors());
app.use(express.json());
// bodyparser urlencode config
app.use(bodyParser.urlencoded({
    extended: true
}));

// bodyparser json config
app.use(bodyParser.json({
    limit: "8mb",
}));

// route
app.use('/', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
