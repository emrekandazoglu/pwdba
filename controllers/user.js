const { getCommonUsages } = require('../helpers/tureng');
const { getFirstExampleSentence } = require('../helpers/turengExample');
const { getTTS } = require('../helpers/audio');
const { Category, Word, Sentence } = require('../models');

exports.getAllData = async(req, res) => {
    try {
        // Tüm kategorileri çek
        const categories = await Category.findAll({
            attributes: ['id', 'category_name'],
        });

        // Tüm kelimeleri kategorileri ve cümleleriyle birlikte çek
        const words = await Word.findAll({
            include: [{
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
        res.status(500).render('newWord', {
            title: 'User Page',
            words: [],
            categories: [],
            errorMessage: 'Veritabanından bilgiler alınırken bir hata oluştu.',
        });
    }
};

exports.postData = async(req, res) => {
    try {
        const { wordInput, category } = req.body;

        if (!wordInput || !category) {
            return res.status(400).render('newWord', {
                title: 'User Page',
                words: await Word.findAll({
                    include: [
                        { model: Category, attributes: ['category_name'] },
                        {
                            model: Sentence,
                            attributes: ['english_sentence', 'turkish_sentence'],
                            separate: true,
                        },
                    ],
                }),
                categories: await Category.findAll({
                    attributes: ['id', 'category_name'],
                }),
                errorMessage: 'Kelime ve kategori alanları zorunludur',
            });
        }

        // Kategori ID'sinin geçerli olup olmadığını kontrol et
        const categoryExists = await Category.findByPk(parseInt(category));
        if (!categoryExists) {
            return res.status(400).render('newWord', {
                title: 'User Page',
                words: await Word.findAll({
                    include: [
                        { model: Category, attributes: ['category_name'] },
                        {
                            model: Sentence,
                            attributes: ['english_sentence', 'turkish_sentence'],
                            separate: true,
                        },
                    ],
                }),
                categories: await Category.findAll({
                    attributes: ['id', 'category_name'],
                }),
                errorMessage: 'Geçersiz kategori ID',
            });
        }

        // API'lerden verileri al
        const result = await getCommonUsages(wordInput);
        const sentenceResult = await getFirstExampleSentence(wordInput);

        const sentence =
            sentenceResult && sentenceResult.success ?
            sentenceResult.example :
            { english: 'Veri bulunamadı', turkish: 'Veri bulunamadı' };

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
        res.status(500).render('newWord', {
            title: 'User Page',
            words: await Word.findAll({
                include: [
                    { model: Category, attributes: ['category_name'] },
                    {
                        model: Sentence,
                        attributes: ['english_sentence', 'turkish_sentence'],
                        separate: true,
                    },
                ],
            }),
            categories: await Category.findAll({
                attributes: ['id', 'category_name'],
            }),
            errorMessage: 'Kelime eklenirken bir hata oluştu',
        });
    }
};

exports.deleteWord = async(req, res) => {
    try {
        const { id } = req.params;

        const word = await Word.findByPk(id);
        if (!word) {
            return res.status(404).render('newWord', {
                title: 'User Page',
                words: await Word.findAll({
                    include: [
                        { model: Category, attributes: ['category_name'] },
                        {
                            model: Sentence,
                            attributes: ['english_sentence', 'turkish_sentence'],
                            separate: true,
                        },
                    ],
                }),
                categories: await Category.findAll({
                    attributes: ['id', 'category_name'],
                }),
                errorMessage: 'Kelime bulunamadı',
            });
        }

        await word.destroy();

        // /user/yeni-kelime sayfasına yönlendir
        res.redirect('/user/yeni-kelime');
    } catch (error) {
        console.error('Error in deleteWord:', error);
        res.status(500).render('newWord', {
            title: 'User Page',
            words: await Word.findAll({
                include: [
                    { model: Category, attributes: ['category_name'] },
                    {
                        model: Sentence,
                        attributes: ['english_sentence', 'turkish_sentence'],
                        separate: true,
                    },
                ],
            }),
            categories: await Category.findAll({
                attributes: ['id', 'category_name'],
            }),
            errorMessage: 'Kelime silinirken bir hata oluştu',
        });
    }
};

exports.getUpdateWord = async(req, res) => {
    try {
        const { id } = req.params;

        const word = await Word.findOne({
            where: { id },
            include: [
                { model: Category, attributes: ['category_name'] },
                {
                    model: Sentence,
                    attributes: ['id', 'english_sentence', 'turkish_sentence'],
                },
            ],
        });

        if (!word) {
            return res.status(404).redirect('/user/yeni-kelime');
        }

        const categories = await Category.findAll({
            attributes: ['id', 'category_name'],
        });

        res.render('updateWord', {
            title: 'Kelime Düzenle',
            word,
            categories,
        });
    } catch (error) {
        console.error('Error in getUpdateWord:', error);
        res.status(500).redirect('/user/yeni-kelime');
    }
};

exports.updateWord = async(req, res) => {
    try {
        const { id } = req.params;
        const { english, turkish, type, category, sentences, deletedSentences } =
        req.body;

        // Update word
        await Word.update({
            english,
            turkish,
            type,
            category_id: category,
        }, {
            where: { id },
        });

        // Handle deleted sentences
        if (deletedSentences) {
            const deletedIds = Array.isArray(deletedSentences) ?
                deletedSentences :
                [deletedSentences];
            await Sentence.destroy({
                where: {
                    id: deletedIds,
                    word_id: id,
                },
            });
        }

        // Handle sentences
        if (sentences && Array.isArray(sentences)) {
            for (const sentence of sentences) {
                if (sentence.id) {
                    // Update existing sentence
                    await Sentence.update({
                        english_sentence: sentence.english,
                        turkish_sentence: sentence.turkish,
                    }, {
                        where: {
                            id: sentence.id,
                            word_id: id,
                        },
                    });
                } else if (sentence.english && sentence.turkish) {
                    // Create new sentence
                    await Sentence.create({
                        english_sentence: sentence.english,
                        turkish_sentence: sentence.turkish,
                        word_id: id,
                    });
                }
            }
        }

        res.redirect('/user/yeni-kelime');
    } catch (error) {
        console.error('Error in updateWord:', error);
        res.status(500).json({
            success: false,
            message: 'Kelime güncellenirken bir hata oluştu',
        });
    }
};
exports.postCategory = async(req, res) => {
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

exports.getCategories = async(req, res) => {
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