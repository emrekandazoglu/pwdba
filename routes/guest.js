const express = require('express');
const { index } = require('../controllers/guest');

const router = express.Router();

router.get('/', index);

module.exports = router;
