const { getCommonUsages } = require('../helpers/tureng');
const { getFirstExampleSentence } = require('../helpers/turengExample');
const { getTTS } = require('../helpers/audio');
const { Category, Word, Sentence } = require('../models');

exports.getAllData = async (req, res) => {
	try {
		// Tüm kategorileri çek
		const categories = await Category.findAll({
			attributes: ['id', 'category_name'],
		});

		// Tüm kelimeleri kategorileri ve cümleleriyle birlikte çek
		const words = await Word.findAll({
			include: [
				{
					model: Category,
					attributes: ['category_name'],
				},
				{
					model: Sentence,
					attributes: ['english_sentence', 'turkish_sentence'],
					separate: true,
				},
			],
		});

		// EJS template'e verileri gönder
		res.render('newWord', {
			title: 'User Page',
			words: words,
			categories: categories,
		});
	} catch (error) {
		console.error('Error fetching data:', error);
		res.status(500).send('Veritabanından bilgiler alınırken bir hata oluştu.');
	}
};

exports.postData = async (req, res) => {
	try {
		const { wordInput, category } = req.body;

		if (!wordInput || !category) {
			return res.status(400).json({
				success: false,
				message: 'Kelime ve kategori alanları zorunludur',
			});
		}

		// Kategori ID'sinin geçerli olup olmadığını kontrol et
		const categoryExists = await Category.findByPk(parseInt(category));
		if (!categoryExists) {
			return res.status(400).json({
				success: false,
				message: 'Geçersiz kategori ID',
			});
		}

		// API'lerden verileri al
		const result = await getCommonUsages(wordInput);
		const sentenceResult = await getFirstExampleSentence(wordInput);

		const sentence =
			sentenceResult && sentenceResult.success
				? sentenceResult.example
				: { english: 'Veri bulunamadı', turkish: 'Veri bulunamadı' };

		// Veritabanına kelimeyi kaydet
		const newWord = await Word.create({
			english: wordInput,
			turkish: result.data.turkish || 'Çeviri bulunamadı',
			type: result.data.type || 'Belirsiz',
			category_id: parseInt(category), // category_id kullanıyoruz
		});

		// Örnek cümleyi kaydet
		if (sentence.english !== 'Veri bulunamadı') {
			await Sentence.create({
				english_sentence: sentence.english,
				turkish_sentence: sentence.turkish,
				word_id: newWord.id, // word_id kullanıyoruz
			});
		}

		// Güncel verileri çek
		res.redirect('yeni-kelime');
	} catch (error) {
		console.error('Error in postData:', error);
		res.status(500).json({
			success: false,
			message: 'Hatalı kelime girildi',
			error: error.message,
		});
	}
};

exports.postCategory = async (req, res) => {
	try {
		const { categoryInput } = req.body;
		if (!categoryInput) {
			return res.status(400).json({
				success: false,
				message: 'Kategori adı boş olamaz',
			});
		}

		const newCategory = await Category.create({
			category_name: categoryInput,
		});

		res.redirect('kategori-ekle');
	} catch (error) {
		console.error('Error in postCategory:', error);
		res.status(500).json({
			success: false,
			message: 'Kategori eklenirken bir hata oluştu',
			error: error.message,
		});
	}
};

exports.getCategories = async (req, res) => {
	try {
		const categories = await Category.findAll({
			attributes: ['id', 'category_name'],
		});

		res.render('createCategory', {
			title: 'User Page',
			categories: categories,
		});
	} catch (error) {
		console.error('Error fetching categories:', error);
		res.status(500).send('Kategoriler alınırken bir hata oluştu');
	}
};
