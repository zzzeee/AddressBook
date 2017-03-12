var mongoose = require('mongoose');
var db = require('../conn');
var departmentSchema = require('../Schema/departmentSchema');
var Departments = db.model('Departments', departmentSchema);

module.exports = Departments;