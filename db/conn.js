const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('ct', 'root', '1234', {
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