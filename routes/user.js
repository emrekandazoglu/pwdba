const express = require('express');
const { getpage } = require('../controllers/user');

const router = express.Router();
router.get('/yeni-kelime', getpage);

module.exports = router;
