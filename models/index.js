// Indicate the code should be executed in "strict mode".
// Meaning, cannot use undeclared variables.
'use strict';

// Requiring necessary npm packages and paths/files.

// This requirement allows the use to use the built in node.js file system.
var fs        = require('fs');
// Allows user to connect with the files and directory path built in node.js.
var path      = require('path');
// This module allows the user to connect with the server and a database.
var Sequelize = require('sequelize');
// This returns the absolute path of the file where it's called in VS code.
var basename  = path.basename(module.filename);
// If the NODE_ENV key in process.env is not defined, env is assigned to 'development'.
var env       = process.env.NODE_ENV || 'development';
// This allows login config to access MySQL by directing to the config.json file.
var config    = require(__dirname + '/../config/config.json')[env];
// This assigns an empty object to the variable db.
var db        = {};

// If config.use_env_variable is a key
if (config.use_env_variable) {
  // Then create a new variable called sequelize using the defined config.use_env_variable
  var sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
  // Otherwise, create a new variable called sequelize using the config values.
  var sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  // .readdirSync returns an array from (__dirname).
  .readdirSync(__dirname)
  // .filter is a callback function for each array and returns a new array.
  .filter(function(file) {
    // This will return true with the requirements below (does not begin with '.' or basename and is a .js file).
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  // This passes each array item with the forEach callback function
  .forEach(function(file) {
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });
//The Object.keys() method returns an array of a given object's own enumerable property names. It iterates in the same order that a normal loop would.
Object.keys(db).forEach(function(modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

//Redefining variables
db.sequelize = sequelize;
db.Sequelize = Sequelize;

//db exports to the module
module.exports = db;
