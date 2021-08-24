const Sequilize = require('sequelize')
const config = require('config')

const instancia = new Sequilize(
  config.get('mysql.banco-de-dados'),
  config.get('mysql.usuario'),
  config.get('mysql.senha'),
  {
    host: config.get('mysql.host'),
    dialect: 'mysql'
  }
)

module.exports = instancia
