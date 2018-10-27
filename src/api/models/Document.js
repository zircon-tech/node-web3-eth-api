export default (sequelize, DataTypes) => {
  const Document = sequelize.define(
    'Document',
    {
      id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        field: 'created_at',
      },
      updatedAt: {
        type: DataTypes.DATE,
        field: 'updated_at',
      },
      deletedAt: {
        type: DataTypes.DATE,
        field: 'deleted_at',
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
    }
  );

  Document.associate = (models) => {
    Document.hasMany(models.DocumentVersion, {
      foreignKey: {
        allowNull: true,
        field: 'document_id',
      },
      as: 'versions',
    });
  };

  Document.prototype.toJSON = function() {
    return {
      id: this.id,
      date: this.createdAt,
      versions: this.versions || [],
    };
  };

  return Document;
};
