var mongoose = require('mongoose');
mongoose.Promise = global.Promise
var db = mongoose.connect('mongodb://linzeyong:123456@localhost/AddressBook');

module.exports = db;