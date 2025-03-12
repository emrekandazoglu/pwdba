const { DataTypes } = require('sequelize');
const sequelize = require('../data/db');
const Category = require('./category');

const Word = sequelize.define('Word', {
	english: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	turkish: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	type: {
		type: DataTypes.STRING,
		allowNull: false,
	},
});

// **Kelime bir kategoriye ait**
Word.belongsTo(Category, { foreignKey: 'category_id', onDelete: 'CASCADE' });
Category.hasMany(Word, { foreignKey: 'category_id', onDelete: 'CASCADE' });

module.exports = Word;
