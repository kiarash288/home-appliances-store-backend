const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Favorite extends Model {
    static associate(models) {
      Favorite.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      Favorite.belongsTo(models.Item, {
        foreignKey: 'item_id',
        as: 'item',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }

  Favorite.init(
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
      item_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Favorite',
      tableName: 'favorites',
      underscored: true,
      timestamps: true,
      updatedAt: false,
      indexes: [
        {
          unique: true,
          name: 'uq_favorites_user_item',
          fields: ['user_id', 'item_id'],
        },
      ],
    }
  );

  return Favorite;
};
