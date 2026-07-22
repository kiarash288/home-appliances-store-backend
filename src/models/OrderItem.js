const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class OrderItem extends Model {
    static associate(models) {
      OrderItem.belongsTo(models.Order, {
        foreignKey: 'order_id',
        as: 'order',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      OrderItem.belongsTo(models.Item, {
        foreignKey: 'item_id',
        as: 'item',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      });
    }
  }

  OrderItem.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      order_id: {
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
      unit_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'OrderItem',
      tableName: 'order_items',
      underscored: true,
      timestamps: false,
    }
  );

  return OrderItem;
};
