var mongoose = require('mongoose');
var db = require('../conn');
var usersSchema = require('../Schema/usersSchema');
var users = db.model('users', usersSchema);

module.exports = users;