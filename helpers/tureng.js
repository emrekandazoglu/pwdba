const puppeteer = require('puppeteer');

async function getCommonUsages(word) {
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
			`https://tureng.com/tr/turkce-ingilizce/${encodeURIComponent(word)}`,
			{
				waitUntil: 'domcontentloaded',
				timeout: 2000,
			}
		);

		await page.waitForSelector(
			'tr.tureng-manual-stripe-odd, tr.tureng-manual-stripe-even',
			{
				timeout: 2000,
			}
		);

		const result = await page.evaluate(() => {
			const rows = document.querySelectorAll(
				'tr.tureng-manual-stripe-odd, tr.tureng-manual-stripe-even'
			);
			const wordTypes = {
				'i.': 'isim',
				'f.': 'fiil',
				's.': 'sıfat',
				'zm.': 'zamir',
				'ed.': 'edat',
				'bağ.': 'bağlaç',
				'zf.': 'zarf',
			};

			let commonUsage = null;
			let firstGeneralUsage = null;

			rows.forEach(row => {
				const category = row
					.querySelector('td.hidden-xs:nth-child(2)')
					?.textContent?.trim();
				const isCommonUsage = category === 'Yaygın Kullanım';
				const isGeneral = category === 'Genel';
				const isIregular = category === 'Irregular Verb';

				let englishText =
					row.querySelector('td.en.tm a')?.textContent?.trim() || '';
				let turkishText =
					row.querySelector('td.tr.ts a')?.textContent?.trim() || '';
				let typeText =
					row.querySelector('td.en.tm i')?.textContent?.trim() || '';

				let type = wordTypes[typeText] || 'Bilinmiyor';

				const entry = {
					english: englishText,
					turkish: turkishText,
					type: type,
				};

				if (isCommonUsage && !commonUsage) {
					commonUsage = entry;
				} else if (isGeneral && !firstGeneralUsage) {
					firstGeneralUsage = entry;
				} else if (isIregular && !firstGeneralUsage) {
					firstGeneralUsage = entry;
				}
			});

			// Önce yaygın kullanım varsa onu döndür, yoksa ilk genel çeviriyi döndür
			return commonUsage || firstGeneralUsage || null;
		});

		// JSON formatına uygun şekilde dönüyoruz
		const response = result
			? { success: true, data: result }
			: { success: false, message: 'Sonuç bulunamadı' };

		return response;
	} catch (error) {
		console.error('Hata:', error);
		return { success: false, message: 'Bir hata oluştu', error: error.message };
	} finally {
		await browser.close();
	}
}

// Kullanım

module.exports = { getCommonUsages };
