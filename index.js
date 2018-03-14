const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

//  Start express app
const app = express();

//  mongodb Connection
mongoose.connect('mongodb://localhost:27017/recipebook');
var db = mongoose.connection;

//  use sessions for tracking logins
app.use(session({
  secret: 'treehouse loves you',
  resave: true,
  saveUnitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

//  make user ID available in templates
app.use(function (req, res, next) {
  res.locals.currentUser = req.session.userId;
  next();
});

//  mongo Error
db.on('error', console.error.bind(console, 'connection error:'));


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
