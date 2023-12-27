const express = require('express');
const router = express.Router({ mergeParams: true });
const jwt = require('jsonwebtoken');
const passport = require('passport');

// const { isEmpty } = require('../utils/utils.js');
// const db = require('../database/db.js');
// const SECRET = require('../../secret.js');
// const { USER_ROLE_COMMERCIAL } = require('../resources/roles.js');
// const {
// } = require('./middlewares/userMiddleware.js');
// const { getATL } = require('../utils/roles.js');

router.get('/',
  async (req, res) => {
    try {
      res.sendStatus(200);
    }
    catch (err) {
      res.sendStatus(err);
    }
  }
);

module.exports = router;