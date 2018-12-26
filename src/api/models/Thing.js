export default (sequelize, DataTypes) => {
  const Thing = sequelize.define(
    'Thing',
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      hash: {
        type: DataTypes.STRING,
        allowNull: false,
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

  Thing.prototype.toJSON = function() {
    return {
      hash: this.hash,
      date: this.createdAt,
      tx: this.tx || null,
      status: this.status,
    };
  };

  return Thing;
};
