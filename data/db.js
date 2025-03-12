const { Sequelize } = require('sequelize');

const config = {
	db: {
		host: 'localhost',
		user: 'root',
		password: '12345678',
		database: 'wordmasterdb',
	},
};

const sequelize = new Sequelize(
	config.db.database,
	config.db.user,
	config.db.password,
	{
		dialect: 'mysql',
		host: config.db.host,
		define: {
			timestamps: false,
		},
	}
);

module.exports = sequelize;
