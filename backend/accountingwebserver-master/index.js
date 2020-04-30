
"use strict";
const express = require('express');
const bodyParser = require('body-parser');
var compression = require('compression');
const app = express();

var SqlString = require('sqlstring');
var _ = require('lodash');
const  createApiResponse  = require('./Util/createApiResponse.js');
const { authenticate, authenticationError } = require('aws-cognito-express');
var cors = require('cors')
var helmet = require('helmet');

// parse application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())
app.use(compression());


app.use(authenticate({
  region: 'us-east-1',
  userPoolId: 'us-east-1_Y1tDBI0El',
  tokenUse: ['id', 'access'],
  audience: ['2aq1k8r54ghain2g6h9236pkbo']
}));

app.use(authenticationError());

app.use(helmet());

var account = require('./route/account.route');
var combo = require('./route/combo.route');
var estadoCuenta = require('./route/estado.cuenta.route');
var fechaFilter = require('./route/fecha.filter.route');
var comparativa = require('./route/comparativa.ingreso.route');
app.use('/api', account);
app.use('/api',combo);
app.use('/api',estadoCuenta);
app.use('/api',fechaFilter);
app.use('/api',comparativa);
 

require('dotenv').config();
//Server listening
app.listen(3000,() =>{


  console.log('Server started on port 3000...');
});





