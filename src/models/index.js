const { Sequelize } = require('sequelize');
const sequelize = require('../config/database');

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
db.Session = require('./Session')(sequelize);

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
