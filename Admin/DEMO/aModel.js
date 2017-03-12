var mongoose = require('mongoose');
var db = require('./mongoose_conn');
var aSchema = require('./aSchema');
var Log = db.model('users', aSchema);

module.exports = Log;