const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const mongoose = require('mongoose');

//  Start express app
const app = express();

//  mongodb Connection
mongoose.connect('mongodb://localhost:27017/recipebook');
var db = mongoose.connection;

//  mongo Error
db.on('error', console.error.bind(console, 'connection error:'));
//
// //  Connection URL
// const url = 'mongodb://localhost:27017';
//
// // Database name
// const dbName = 'recipebook';
//
// // Use connect method to connect to the Mongod server
// MongoClient.connect(url, function(err, client) {
//   assert.equal(null, err);
//   console.log('Connected successfully to the server');
//
//   const db = client.db(dbName);
//
//   insertRecipes(db, function() {
//       client.close();
//   });
// });
//
// const insertRecipes = function(db, callback) {
//   // Get the recipes collection
//   const recipeCollection = db.collection('recipes');
//
//   // Insert some recipes
//   recipeCollection.insertMany([
//     {a: 1}, {a : 2}, {a : 3}
//   ], function(err, result) {
//     assert.equal(err, null);
//     assert.equal(3, result.result.n);
//     assert.equal(3, result.ops.length);
//     console.log('Inserted 3 recipes into the recipe collection');
//     callback(result);
//   });
//
//
// };

app.use(bodyParser.urlencoded({ extended: false}));
app.use(cookieParser());
app.use(express.static('./public/'));

//  Set templating and view engine
app.set('view engine', 'pug');

const mainRoutes = require('./routes');
app.use(mainRoutes);

//  Catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('File not found');
  err.status = 404;
  next(err);
});

//  error handler
//  defined as the last app.use callback
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.listen(3000, () =>  console.log('Server is running on localhost 3000!'));
