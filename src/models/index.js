const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    dialectOptions: {
      charset: 'utf8mb4',
    },
    define: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
      underscored: true,
    },
    timezone: '+00:00',
  }
);

const db = {};

db.User = require('./User')(sequelize);
db.Category = require('./Category')(sequelize);
db.Address = require('./Address')(sequelize);
db.Basket = require('./Basket')(sequelize);
db.Item = require('./Item')(sequelize);
db.Order = require('./Order')(sequelize);
db.BasketItem = require('./BasketItem')(sequelize);
db.Favorite = require('./Favorite')(sequelize);
db.OrderItem = require('./OrderItem')(sequelize);
db.Payment = require('./Payment')(sequelize);
db.Review = require('./Review')(sequelize);

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
