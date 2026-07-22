const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Basket extends Model {
    static associate(models) {
      Basket.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      Basket.hasMany(models.BasketItem, {
        foreignKey: 'basket_id',
        as: 'basketItems',
        onDelete: 'CASCADE',
        onUpdate: 'RESTRICT',
      });
      Basket.belongsToMany(models.Item, {
        through: models.BasketItem,
        foreignKey: 'basket_id',
        otherKey: 'item_id',
        as: 'items',
      });
    }
  }

  Basket.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Basket',
      tableName: 'baskets',
      underscored: true,
      timestamps: true,
    }
  );

  return Basket;
};
