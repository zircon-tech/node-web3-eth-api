export default (sequelize, DataTypes) => {
  const DocumentVersion = sequelize.define(
    'DocumentVersion',
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      documentId: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'document_id',
      },
      hash: {
        type: DataTypes.STRING,
        allowNull: false,
        // unique: true,
      },
      status: {
        allowNull: false,
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      tx: {
        type: DataTypes.STRING,
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

  DocumentVersion.associate = (models) => {
    DocumentVersion.belongsTo(models.Document, {
      foreignKey: {
        allowNull: false,
        name: 'documentId',
        field: 'document_id',
      },
      as: 'document',
    });
  };

  DocumentVersion.prototype.toJSON = function() {
    return {
      hash: this.hash,
      date: this.createdAt,
      tx: this.tx || null,
      status: this.status,
    };
  };

  return DocumentVersion;
};
