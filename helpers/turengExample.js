const puppeteer = require('puppeteer');

async function getFirstExampleSentence(word) {
	const browser = await puppeteer.launch({
		headless: 'new',
		args: [
			'--no-sandbox',
			'--disable-setuid-sandbox',
			'--disable-dev-shm-usage',
			'--disable-gpu',
			'--disable-extensions',
			'--disable-notifications',
			'--disable-logging',
			'--disable-infobars',
			'--no-default-browser-check',
		],
	});

	try {
		const page = await browser.newPage();
		await page.setRequestInterception(true);
		page.on('request', req => {
			if (
				['image', 'stylesheet', 'font', 'media'].includes(req.resourceType())
			) {
				req.abort();
			} else {
				req.continue();
			}
		});

		await page.setCacheEnabled(true);
		await page.setViewport({ width: 800, height: 600 });
		await page.setUserAgent(
			'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
		);

		await page.goto(
			`https://tureng.com/tr/turkce-ingilizce-cumleler/${encodeURIComponent(
				word
			)}`,
			{
				waitUntil: 'domcontentloaded',
				timeout: 5000,
			}
		);

		await page.waitForSelector('.sentencePair', { timeout: 2000 });

		const result = await page.evaluate(() => {
			const sentencePair = document.querySelector('.sentencePair');
			if (!sentencePair) return null;

			const englishSentence =
				sentencePair.querySelector('ul li:first-child')?.textContent.trim() ||
				null;
			const turkishSentence =
				sentencePair.querySelector('ul li:last-child')?.textContent.trim() ||
				null;

			return englishSentence && turkishSentence
				? { english: englishSentence, turkish: turkishSentence }
				: null;
		});

		const response = result
			? { success: true, example: result }
			: { success: false, message: 'Örnek cümle bulunamadı' };

		return response;
	} catch (error) {
		console.error('Hata:', error);
		return { success: false, message: 'Bir hata oluştu', error: error.message };
	} finally {
		await browser.close();
	}
}

// Kullanım
module.exports = { getFirstExampleSentence };
