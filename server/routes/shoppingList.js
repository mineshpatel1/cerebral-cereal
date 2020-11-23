const express = require('express');
const router = express.Router();

const { AUTH_ERROR } = require(__dirname + '/../utils/utils');
const shoppingList = require(__dirname + '/../models/shoppingList');

router.post('/shoppingList/addItems', (req, res, next) => {
  if (!req.session.user) return next(new Error(AUTH_ERROR));
  if (!req.body.items) return next(new Error("Parameter: items is required."))

  shoppingList.addItems(req.body.items)
    .then(() => res.send({}))
    .catch(next);
});

module.exports = router;