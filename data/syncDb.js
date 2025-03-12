const sequelize = require('../data/db');
const { Category, Word, Sentence } = require('../models');
const seedDatabase = require('./seed');

async function syncDatabase() {
	try {
		await sequelize.sync({ force: false }); // Tabloları oluştur veya güncelle
		console.log('✅ Database synchronized successfully.');
		seedDatabase(); // Veritabanına örnek verileri ekle
	} catch (error) {
		console.error('❌ Database synchronization failed:', error);
		process.exit(1); // Hata olursa süreci sonlandır
	}
}

module.exports = syncDatabase;
