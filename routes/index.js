const express = require('express');
const router = express.Router();

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
  const name = req.cookies.username;
  if (name) {
    res.render('home', {name});
  } else {
    res.redirect('/hello');
  }
});

//  GET /hello
router.get('/hello', (req, res) => {
  const name = req.cookies.username;
  if (name) {
    res.render('home', {name});
  } else {
    res.render('hello');
  }
});

router.post('/hello', (req, res) => {
  res.cookie('username', req.body.username);
  res.redirect('/');
});

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

router.get('/register', (req, res, next) => {
  res.render('register', { title: 'Sign up'});
});

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
      } else {
        var err = new Error('All fields are required.');
        err.status = 400;
        return next(err);
      }
});

router.get('/goodbye', (req, res) => {
  res.clearCookie('username');
  res.redirect('/hello');
});

module.exports = router;
