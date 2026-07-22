const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      });
      Order.belongsTo(models.Address, {
        foreignKey: 'address_id',
        as: 'address',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      });
      Order.hasMany(models.OrderItem, {
        foreignKey: 'order_id',
        as: 'orderItems',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      Order.hasMany(models.Payment, {
        foreignKey: 'order_id',
        as: 'payments',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      Order.belongsToMany(models.Item, {
        through: models.OrderItem,
        foreignKey: 'order_id',
        otherKey: 'item_id',
        as: 'items',
      });
    }
  }

  Order.init(
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
      address_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      total_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(
          'pending',
          'processing',
          'shipped',
          'delivered',
          'cancelled'
        ),
        allowNull: false,
        defaultValue: 'pending',
      },
    },
    {
      sequelize,
      modelName: 'Order',
      tableName: 'orders',
      underscored: true,
      timestamps: true,
    }
  );

  return Order;
};
