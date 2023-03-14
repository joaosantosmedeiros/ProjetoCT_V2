const { DataTypes } = require('sequelize')
const db = require('../db/conn')

const Product = require('./Product')
const User = require('./User')

const Order = db.define('Order', {
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    totalPrice:{
        type: DataTypes.FLOAT,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('Aceito', 'Pendente', 'Recusado'),
        defaultValue: 'Pendente',
        allowNull: false
    }
})

Product.hasOne(Order, {
    onDelete: 'NO ACTION',
    foreignKey: {
        name: 'productName',
    },
    sourceKey: ['name']
})
User.hasMany(Order, { onDelete: 'NO ACTION' })


module.exports = Order