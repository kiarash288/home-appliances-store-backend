const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class BasketItem extends Model {
    static associate(models) {
      BasketItem.belongsTo(models.Basket, {
        foreignKey: 'basket_id',
        as: 'basket',
        onDelete: 'CASCADE',
        onUpdate: 'RESTRICT',
      });
      BasketItem.belongsTo(models.Item, {
        foreignKey: 'item_id',
        as: 'item',
        onDelete: 'CASCADE',
        onUpdate: 'RESTRICT',
      });
    }
  }

  BasketItem.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      basket_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      item_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 1,
      },
    },
    {
      sequelize,
      modelName: 'BasketItem',
      tableName: 'basket_items',
      underscored: true,
      timestamps: false,
      indexes: [
        {
          unique: true,
          name: 'uq_basket_item',
          fields: ['basket_id', 'item_id'],
        },
      ],
    }
  );

  return BasketItem;
};
