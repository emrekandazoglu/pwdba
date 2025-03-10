// helpers/audio.js
const googleTTS = require('google-tts-api'); // google-tts-api paketini dahil et

// Sesli telaffuz almak için fonksiyon
async function getTTS(word) {
	try {
		// Ses dosyasının URL'sini almak
		const url = googleTTS.getAudioUrl(word, {
			lang: 'en',
			slow: false,
			host: 'https://translate.google.com',
		});

		// URL üzerinden ses dosyasını Base64 formatında almak
		const audioBase64 = await fetch(url)
			.then(response => response.arrayBuffer())
			.then(buffer => Buffer.from(buffer).toString('base64'));

		return audioBase64;
	} catch (error) {
		console.error('TTS Hatası:', error);
		throw new Error('Ses dosyası alınırken hata oluştu');
	}
}

module.exports = { getTTS };
