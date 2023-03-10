const { DataTypes } = require('sequelize')
const db = require('../db/conn')

const Product = db.define('Product', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    unity: {
        type: DataTypes.ENUM('Kilograma', 'Litro'),
        allowNull: false
    },
}, { timestamps: false })

module.exports = Product