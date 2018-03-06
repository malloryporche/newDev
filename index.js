const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.static('./public/'));

app.set('view engine', 'pug');

app.get('/', function(req,res) {
  res.render('home'); 
});

app.listen(3000, () =>  console.log('App is listening on port 3000!'));