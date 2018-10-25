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
        allowNull: false,
        field: 'created_at',
        defaultValue: sequelize.fn('NOW'),
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'updated_at',
        defaultValue: sequelize.fn('NOW'),
      },
      deletedAt: {
        type: DataTypes.DATE,
        field: 'deleted_at',
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
    },
    {
      classMethods: {
        associate: (models) => {
          Document.hasMany(models.DocumentVersion, {
            foreignKey: {
              allowNull: true,
              name: 'documentId',
              field: 'document_id',
            },
            as: 'versions',
          });
        },
      },
    }
  );

  return Document;
};
