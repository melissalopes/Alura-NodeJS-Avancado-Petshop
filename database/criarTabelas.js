const modelos = [
  require('../rotas/fornecedores/ModeloTabelaFornecedor'),
  require('../rotas/produtos/ModeloTabelaProduto')
]

async function criarTabelas () {
  for (let contador = 0; contador < modelos.length; contador++) {
    const modelo = modelos[contador]
    await modelo.sync()
  }
}

criarTabelas()
