const express = require('express');
const { getCommonUsages } = require('../helpers/tureng'); // tureng.js dosyasını dahil et
const { getFirstExampleSentence } = require('../helpers/turengExample');
const { getTTS } = require('../helpers/audio'); // audio.js dosyasını dahil et
const { indexGet, indexPost } = require('../controllers/guest');
const { getWord } = require('../controllers/user');
const router = express.Router();

router.get('/', indexGet);

router.post('/', indexPost);

module.exports = router;
