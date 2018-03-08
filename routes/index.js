const express = require('express');
const router = express.Router();

const recipes = [
  {
    'name': 'raw Tacos',
    'description': 'greatest raw tacos ever',
    'onMenu': false,
  },
  {
    'name': 'vegan Empanadas',
    'description': 'greatest empanadas ever',
    'onMenu': false,
  },
  {
    'name': 'raw desserts',
    'description': 'greatest raw desserts ever',
    'onMenu': false,
  },
  {
    'name': 'raw snacks',
    'description': 'greatest raw snacks ever',
    'onMenu': false,
  }
];

router.get('/', (req, res) => {
  const name = req.cookies.username;
  if (name) {
    res.render('home', {name});
  } else {
    res.redirect('/hello');
  }
});

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


module.exports = router;
