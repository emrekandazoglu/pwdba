const { sequelize, Category, Word, Sentence } = require('../models');

async function seedDatabase() {
	try {
		// **Önce tüm verileri temizle (isteğe bağlı)**
		await Sentence.destroy({ where: {} });
		await Word.destroy({ where: {} });
		await Category.destroy({ where: {} });

		// **Kategorileri ekle**
		const categories = await Category.bulkCreate([
			{ category_name: 'Animals' },
			{ category_name: 'Technology' },
			{ category_name: 'Food' },
		]);

		// **Kelimeleri ekle**
		const words = await Word.bulkCreate([
			{
				english: 'Dog',
				turkish: 'Köpek',
				base64:
					'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABKklEQVR42mNk',
				type: 'noun',
				category_id: categories[0].id,
			},
			{
				english: 'Computer',
				turkish: 'Bilgisayar',
				base64:
					'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABKklEQVR42mNk',
				type: 'noun',
				category_id: categories[1].id,
			},
			{
				english: 'Pizza',
				turkish: 'Pizza',
				base64:
					'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABKklEQVR42mNk',
				type: 'noun',
				category_id: categories[2].id,
			},
		]);

		// **Cümleleri ekle**
		await Sentence.bulkCreate([
			{
				english_sentence: 'I love my dog.',
				turkish_sentence: 'Köpeğimi seviyorum.',
				word_id: words[0].id,
			},
			{
				english_sentence: 'My computer is fast.',
				turkish_sentence: 'Bilgisayarım hızlıdır.',
				word_id: words[1].id,
			},
			{
				english_sentence: 'Pizza is delicious.',
				turkish_sentence: 'Pizza lezzetlidir.',
				word_id: words[2].id,
			},
		]);

		console.log('✅ Dummy data inserted successfully.');
	} catch (error) {
		console.error('❌ Error inserting dummy data:', error);
	}
}

// **Fonksiyonu çalıştır**
module.exports = seedDatabase;
