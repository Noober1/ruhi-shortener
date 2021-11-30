require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');


const middlewares = require('./middlewares');
const api = require('./api');

const app = express();

app.set('view engine', 'ejs');

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

// route
app.use('/', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
