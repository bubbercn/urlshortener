'use strict';

var mongoose = require('mongoose');
var dbURL = "mongodb+srv://admin:admin@urlshortener-fdsza.azure.mongodb.net/test?retryWrites=true&w=majority";

mongoose.Promise = global.Promise;

mongoose.connect(dbURL, { useNewUrlParser: true });

module.exports = mongoose;