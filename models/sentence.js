const { DataTypes } = require('sequelize');
const sequelize = require('../data/db');
const Word = require('./word');

const Sentence = sequelize.define('Sentence', {
	english_sentence: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	turkish_sentence: {
		type: DataTypes.STRING,
		allowNull: false,
	},
});

// **Cümle bir kelimeye ait**
Sentence.belongsTo(Word, { foreignKey: 'word_id', onDelete: 'CASCADE' });
Word.hasMany(Sentence, { foreignKey: 'word_id', onDelete: 'CASCADE' });

module.exports = Sentence;
