const { DataTypes } = require('sequelize')

const db = require('../db/conn')

const User = db.define('User', {

    name: {
        type: DataTypes.STRING,
        allowNull: false,
        require: true
    },
    cpf: {
        type: DataTypes.BIGINT(14),
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    type: {
        type: DataTypes.ENUM('user', 'admin'),
        defaultValue: 'user',
        allowNull: false
    }
})

module.exports = User   