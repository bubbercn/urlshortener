var mongoose = require('./db.js');
var Schema = mongoose.Schema;

var urlSchema = new Schema({
    url: {
        type: 'String',
        unique: true
    },
    id: {
        type: 'Number',
        unique: true
    }
});

module.exports = mongoose.model('url', urlSchema);
