const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Item, { // one to many relationship with items for creators
        foreignKey: 'user_id',
        as: 'items',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      User.hasMany(models.Address, {
        foreignKey: 'user_id',
        as: 'addresses',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      User.hasMany(models.Basket, {
        foreignKey: 'user_id',
        as: 'baskets',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      User.hasMany(models.Order, {
        foreignKey: 'user_id',
        as: 'orders',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      });
      User.hasMany(models.Favorite, {
        foreignKey: 'user_id',
        as: 'favorites',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      User.hasMany(models.Review, {
        foreignKey: 'user_id',
        as: 'reviews',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      User.hasMany(models.Session, {
        foreignKey: 'user_id',
        as: 'sessions',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      User.belongsToMany(models.Item, { // many to many relationship with items for favorites table
        through: models.Favorite,
        foreignKey: 'user_id',
        otherKey: 'item_id',
        as: 'favoriteItems',
      });
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      role: {
        type: DataTypes.ENUM('admin', 'user'),
        allowNull: false,
        defaultValue: 'user',
      },
      first_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: 'uq_users_email',
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
        unique: 'uq_users_phone',
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      underscored: true,
      timestamps: true,
    }
  );

  return User;
};
