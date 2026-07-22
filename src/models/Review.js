const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Review extends Model {
    static associate(models) {
      Review.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      Review.belongsTo(models.Item, {
        foreignKey: 'item_id',
        as: 'item',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }

  Review.init(
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
      rating: {
        type: DataTypes.TINYINT.UNSIGNED,
        allowNull: false,
        validate: {
          min: 1,
          max: 5,
        },
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      is_approved: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'Review',
      tableName: 'reviews',
      underscored: true,
      timestamps: true,
      updatedAt: false,
      indexes: [
        {
          unique: true,
          name: 'uq_reviews_user_item',
          fields: ['user_id', 'item_id'],
        },
      ],
    }
  );

  return Review;
};
