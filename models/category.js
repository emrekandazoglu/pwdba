const { DataTypes } = require('sequelize');
const sequelize = require('../data/db');

const Category = sequelize.define(
	'Category',
	{
		category_name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		timestamps: true, // Son eklenen kategorileri takip etmek için
	}
);

module.exports = Category;
