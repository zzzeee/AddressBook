var mongoose = require('mongoose');
var db = require('../conn');
var noticeSchema = require('../Schema/noticeSchema');
var notices = db.model('notices', noticeSchema);

module.exports = notices;