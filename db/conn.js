const { Sequelize } = require('sequelize')
require('dotenv').config()

const sequelize = new Sequelize('ct', `${process.env.DB_USER}`, `${process.env.DB_PASS}`, {
    host: 'localhost',
    dialect: 'mysql'
})

try {
    sequelize.authenticate()
    console.log('Conexão ao banco de dados efetuada com sucesso.')
    
} catch (error) {
    console.log('Erro na conexão:', error)
}

module.exports = sequelize