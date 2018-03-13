const express = require('express');
const router = express.Router();
const User = require('../models/user');

const recipes = [
  {
    'id': 1,
    'name': 'raw Tacos',
    'description': 'greatest raw tacos ever',
    'ingredients': [
      'walnuts',
      'tomatoes',
      'jicama shells'
    ],
    'onMenu': false,
  },
  {
    'id': 2,
    'name': 'vegan Empanadas',
    'description': 'greatest empanadas ever',
    'ingredients': [
      'black lentils',
      'quinoa',
      'seasonings'
    ],
    'onMenu': false,
  },
  {
    'id': 3,
    'name': 'Raw Desserts',
    'description': 'greatest raw desserts ever',
    'ingredients': [
      'Dates',
      'MozSOrella',
      'Almonds',
      'cashews'
    ],
    'onMenu': false,
  },
  {
    'id': 4,
    'name': 'Raw Snacks',
    'description': 'greatest raw snacks ever',
    'onMenu': false,
  }
];

//  GET /
router.get('/', (req, res) => {
  res.render('home', { title: 'Home'});
});


// GET /recipes
router.get('/recipes', (req, res) => {
  res.render('recipe', {recipes});
});

router.get('/recipes/#{_id}', (req, res) => {
  res.render('recipeHome', {recipes});
});

//  GET /menu
router.get('/menu', (req, res, next) => {
  res.render('menu', { title: 'Our menu', recipes });
});

//  GET /login
router.get('/login', (req, res, next) => {
  res.render('login', { title: 'Login'});
});

//  POST /login
router.post('/login', (req, res, next) => {
  if (req.body.email && req.body.password) {
    User.authenticate(req.body.email, req.body.password, function(error, user) {
      if (error || !user) {
        var err = new Error('Wrong email or password.');
        err.status = 401;
        return next(err);
      } else {
        req.session.userId = user._id;
        return res.redirect('/profile');
      }
    });
  } else {
    var err = new Error('Email and password are required.');
    err.status = 401;
    return next(err);
  }
});

//  GET /register
router.get('/register', (req, res, next) => {
  res.render('register', { title: 'Sign up'});
});


//  POST /register
router.post('/register', (req, res, next) => {
  if (req.body.email &&
      req.body.name &&
      req.body.favoriteBook &&
      req.body.password &&
      req.body.confirmPassword) {

      if (req.body.password !== req.body.confirmPassword) {
        var err = new Error('Passwords do not match.');
        err.status = 400;
        return next(err);
        }

        //  create object with form input
        var userData = {
          email: req.body.email,
          name: req.body.name,
          favoriteBook: req.body.favoriteBook,
          password: req.body.password
        };

        //  use schema's `create` method to insert document into Mongo
        User.create(userData, function(error, user) {
          if (error) {
            return next(error);
          } else {
            req.session.userId = user._id;
            return res.redirect('/profile');
          }
        });

      } else {
        err = new Error('All fields are required.');
        err.status = 400;
        return next(err);
      }
});

//  GET /profile
router.get('/profile', (req, res, next) => {
  if (! req.session.userId) {
    var err = new Error('You are not authorized to view this page.');
    err.status = 401;
    return next(err);
  }
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        return res.render('profile', {
          title: 'Profile',
          name: user.name,
          favorite: user.favoriteBook });
      }
    });
});

router.get('/goodbye', (req, res) => {

  res.redirect('/hello');
});

module.exports = router;
