import express from 'express';
const router = express.Router({ mergeParams: true });
import jwt from 'jsonwebtoken';

// const { isEmpty } = require('../utils/utils.js');
// const db = require('../database/db.js');
// const SECRET = require('../../secret.js');
// const { USER_ROLE_COMMERCIAL } = require('../resources/roles.js');
// const {
// } = require('./middlewares/userMiddleware.js');
// const { getATL } = require('../utils/roles.js');

router.post('/',
  async (req, res) => {
    try {
      res.sendStatus(200);
    }
    catch (err) {
      res.sendStatus(500);
    }
  }
);

export default router;