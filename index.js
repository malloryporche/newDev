const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const User = require('./models/user');

// Passport has an Express method to use passport strategies
//  Configure GitHubStrategy
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/auth/github/return'
}, function(accessToken, refreshToken, profile, done){
  if(profile.emails[0]) {
    User.findOneAndUpdate({
        email: profile.emails[0].value
      }, {
        name: profile.displayName || profile.username,
        email: profile.emails[0].value,
        photo: profile.photos[0].value
      }, {
        upsert: true
      },
      done);
  } else {
      var noEmailError = new Error
      ('Your email privacy settings prevent you from signing into MealPlan');
      done(noEmailError, null);
  }
}));

//  Two functions we need to setup in order to use passport
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(userId, done) {
  User.findById(userId, done);
  });

//  Start express app
const app = express();

//  mongodb Connection
mongoose.connect('mongodb://localhost:27017/recipebook');
var db = mongoose.connection;

//  Session config for Passport and MongoDB
var sessionOptions = {
  secret: 'Mallory loves Mallory',
  resave: true,
  saveUnitialized: true,
  store: new MongoStore({
    mongooseConnection: db
  })
};

app.use(session(sessionOptions));

//  make user ID available in templates
app.use(function (req, res, next) {
  res.locals.currentUser = req.session.userId;
  next();
});

//  Initialize passport
app.use(passport.initialize());

//  Restore Session
app.use(passport.session());

//  mongo Error
db.on('error', console.error.bind(console, 'connection error:'));

app.use(bodyParser.urlencoded({ extended: false}));
app.use(cookieParser());
app.use(express.static('./public/'));

//  Set templating and view engine
app.set('view engine', 'pug');

const mainRoutes = require('./routes');
const auth = require('./routes/auth');


app.use(mainRoutes);
app.use('/auth', auth);

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
