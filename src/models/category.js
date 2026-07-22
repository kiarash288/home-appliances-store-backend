const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Category extends Model {
    static associate(models) {
      Category.belongsTo(models.Category, {
        foreignKey: 'parent_id',
        as: 'parent',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      });
      Category.hasMany(models.Category, {
        foreignKey: 'parent_id',
        as: 'children',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      });
      Category.hasMany(models.Item, {
        foreignKey: 'category_id',
        as: 'items',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      });
    }
  }

  Category.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      parent_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Category',
      tableName: 'categories',
      underscored: true,
      timestamps: true,
    }
  );

  return Category;
};
