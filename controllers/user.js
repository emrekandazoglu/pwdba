const { getCommonUsages } = require('../helpers/tureng'); // tureng.js dosyasını dahil et
const { getFirstExampleSentence } = require('../helpers/turengExample');
const { getTTS } = require('../helpers/audio'); // audio.js dosyasını dahil et

exports.getpage = (req, res) => {
	res.render('newWord', { title: 'User Page' });
};

// exports.postpage = async (req, res) => {
// 	const word = req.body.wordInput; // Formdan gelen kelimeyi al

// 	if (!word) {
// 		// Kelime girilmediyse hata mesajı
// 		return res.status(400).send('Kelime girilmelidir!');
// 	}

// 	try {
// 		// Tureng API'sinden kelimenin yaygın kullanımını al
// 		const result = await getCommonUsages(word);
// 		// Google TTS API'sinden kelimenin sesli telaffuzunu al
// 		const ttsBase64 = await getTTS(word); // Ses verisini Base64 formatında al

// 		// EJS şablonuna yaygın kullanım ve ses verisini gönder
// 		const sentence = await getFirstExampleSentence(word);

// 		// Eğer API'den veri gelmezse varsayılan bir değer ata
// 		const example =
// 			sentence && sentence.success
// 				? sentence.example
// 				: { english: 'Veri bulunamadı', turkish: 'Veri bulunamadı' };

// 		res.render('newWord', {
// 			commonUsages: result,
// 			example: example, // Doğru değişken ismiyle gönder
// 			audio: ttsBase64,
// 		});
// 	} catch (error) {
// 		console.error('Hata:', error);
// 		res.status(500).send('Bir hata oluştu.');
// 	}
// };
