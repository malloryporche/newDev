var mongoose = require('mongoose');
var RecipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  ingredients: {
    type: Array,
    required: true,
  },
  directions: {
    type: Array,
    required: false
  }
});
