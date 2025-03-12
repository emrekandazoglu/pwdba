const sequelize = require('../data/db');
const Category = require('./category');
const Word = require('./word');
const Sentence = require('./sentence');

// **İlişkileri Tanımla**
Category.hasMany(Word, { foreignKey: 'category_id', onDelete: 'CASCADE' });
Word.belongsTo(Category, { foreignKey: 'category_id', onDelete: 'CASCADE' });

Word.hasMany(Sentence, { foreignKey: 'word_id', onDelete: 'CASCADE' });
Sentence.belongsTo(Word, { foreignKey: 'word_id', onDelete: 'CASCADE' });

// **Modelleri Dışa Aktar**
module.exports = { sequelize, Category, Word, Sentence };
