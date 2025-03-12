const express = require('express');
const { getAllData, postData } = require('../controllers/user');

const router = express.Router();
router.get('/yeni-kelime', getAllData);

router.post('/yeni-kelime', postData);

router.get('/audio/:word', async (req, res) => {
	try {
		const word = req.params.word;
		const base64Audio = await getTTS(word);
		res.json({ audio: base64Audio });
	} catch (error) {
		res.status(500).json({ error: 'Ses oluşturulamadı' });
	}
});

module.exports = router;
