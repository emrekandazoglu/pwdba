const express = require('express');
const { getCommonUsages } = require('../helpers/tureng'); // tureng.js dosyasını dahil et
const { getTTS } = require('../helpers/audio'); // audio.js dosyasını dahil et

const router = express.Router();

router.get('/', (req, res) => {
	res.render('index', { title: 'Anasayfa', commonUsages: null, audio: null });
});

router.post('/', async (req, res) => {
	const word = req.body.wordInput; // Formdan gelen kelimeyi al

	if (!word) {
		// Kelime girilmediyse hata mesajı
		return res.status(400).send('Kelime girilmelidir!');
	}

	try {
		// Tureng API'sinden kelimenin yaygın kullanımını al
		const result = await getCommonUsages(word);
		// Google TTS API'sinden kelimenin sesli telaffuzunu al
		const ttsBase64 = await getTTS(word); // Ses verisini Base64 formatında al

		// EJS şablonuna yaygın kullanım ve ses verisini gönder
		res.render('index', {
			commonUsages: result, // Yaygın kullanımlar
			audio: ttsBase64, // Base64 formatındaki ses verisi
		});
	} catch (error) {
		console.error('Hata:', error);
		res.status(500).send('Bir hata oluştu.');
	}
});
module.exports = router;
