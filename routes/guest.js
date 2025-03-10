const express = require('express');
const { index } = require('../controllers/guest');
const { getCommonUsages } = require('../helpers/tureng'); // tureng.js dosyasını dahil et

const router = express.Router();

router.get('/', (req, res) => {
	res.render('index', { title: 'Anasayfa', commonUsages: null });
});
router.post('/', async (req, res) => {
	const word = req.body.wordInput; // Formdan gelen kelimeyi al
	const result = await getCommonUsages(word); // Kelimeyi işlemek için fonksiyonu çağır

	// EJS şablonuna sonucu gönder
	res.render('index', {
		commonUsages: result, // commonUsages verisini şablona gönder
	});
});

module.exports = router;
