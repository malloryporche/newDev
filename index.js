const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const app = express();

//  Connection URL
const url = 'mongodb://localhost:27017';

// Database name
const dbName = 'recipebook';

// Use connect method to connect to the Mongod server
MongoClient.connect(url, function(err, client) {
  assert.equal(null, err);
  console.log('Connected successfully to the server');

  const db = client.db(dbName);

  insertRecipes(db, function() {
      client.close();
  });
});

const insertRecipes = function(db, callback) {
  // Get the recipes collection
  const recipeCollection = db.collection('recipes');
  // Insert some recipes
  recipeCollection.insertMany([
    {a: 1}, {a : 2}, {a : 3}
  ], function(err, result) {
    assert.equal(err, null);
    assert.equal(3, result.result.n);
    assert.equal(3, result.ops.length);
    console.log('Inserted 3 recipes into the recipe collection');
    callback(result);
  });
};



app.use(bodyParser.urlencoded({ extended: false}));
app.use(cookieParser());
app.use(express.static('./public/'));

//  Set templating and view engine
app.set('view engine', 'pug');

const mainRoutes = require('./routes');
const recipeRoutes = require('./routes/recipes');

app.use(mainRoutes);
// app.use('/recipes', recipeRoutes);

app.listen(3000, () =>  console.log('Server is running on localhost 3000!'));
