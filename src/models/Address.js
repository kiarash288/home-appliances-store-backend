const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Address extends Model {
    static associate(models) {
      Address.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      Address.hasMany(models.Order, {
        foreignKey: 'addressId',
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
      userId: {
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
      state: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      postalCode: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      fullAddress: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING(30),
        allowNull: false,
        field: 'phone_number',
      },
      isDefault: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
