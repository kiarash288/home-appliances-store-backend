const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Address extends Model {
    static associate(models) {
      Address.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      Address.hasMany(models.Order, {
        foreignKey: 'address_id',
        as: 'orders',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      });
    }
  }

  Address.init(
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
      title: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      postal_code: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      full_address: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      phone_number: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Address',
      tableName: 'addresses',
      underscored: true,
      timestamps: true,
      updatedAt: false,
    }
  );

  return Address;
};
