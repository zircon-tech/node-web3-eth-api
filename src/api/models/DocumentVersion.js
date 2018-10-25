export default (sequelize, DataTypes) => {
  const DocumentVersion = sequelize.define(
    'DocumentVersion',
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      hash: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
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
          DocumentVersion.belongsTo(models.Document, {
            foreignKey: {
              allowNull: false,
              name: 'documentId',
              field: 'document_id',
            },
            as: 'document',
          });
        },
      },
    }
  );

  return DocumentVersion;
};
