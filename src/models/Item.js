const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Item extends Model {
    static associate(models) {
      Item.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'seller',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      Item.belongsTo(models.Category, {
        foreignKey: 'category_id',
        as: 'category',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      });
      Item.hasMany(models.Favorite, {
        foreignKey: 'item_id',
        as: 'favorites',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      Item.hasMany(models.BasketItem, {
        foreignKey: 'item_id',
        as: 'basketItems',
        onDelete: 'CASCADE',
        onUpdate: 'RESTRICT',
      });
      Item.hasMany(models.OrderItem, {
        foreignKey: 'item_id',
        as: 'orderItems',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      });
      Item.hasMany(models.Review, {
        foreignKey: 'item_id',
        as: 'reviews',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      Item.belongsToMany(models.User, {
        through: models.Favorite,
        foreignKey: 'item_id',
        otherKey: 'user_id',
        as: 'favoritedBy',
      });
      Item.belongsToMany(models.Basket, {
        through: models.BasketItem,
        foreignKey: 'item_id',
        otherKey: 'basket_id',
        as: 'baskets',
      });
      Item.belongsToMany(models.Order, {
        through: models.OrderItem,
        foreignKey: 'item_id',
        otherKey: 'order_id',
        as: 'orders',
      });
    }
  }

  Item.init(
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
      category_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      stock: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },
      main_image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      gallery: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
      },
    },
    {
      sequelize,
      modelName: 'Item',
      tableName: 'items',
      underscored: true,
      timestamps: true,
    }
  );

  return Item;
};
