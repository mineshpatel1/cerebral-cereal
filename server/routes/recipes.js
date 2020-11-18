const express = require('express');
const router = express.Router();

const { AUTH_ERROR } = require(__dirname + '/../utils/utils');
const recipes = require(__dirname + '/../models/recipes');
const ingredients = require(__dirname + '/../models/ingredients');

router.get('/recipes', (req, res, next) => {
  if (!req.session.user) return next(new Error(AUTH_ERROR));

  Promise.all([recipes.getAll(), ingredients.getAll()])
    .then(values => {
      res.send({ recipes: values[0], ingredients: values[1] })
    })
    .catch(next);
});

module.exports = router;