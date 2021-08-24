const roteador = require('express').Router()
const TabelaFornecedor = require('./TabelaFornecedor')
const Fornecedor = require('./Fornecedor')
const SerealizadorFornecedor = require('../../Serializador').SerializadorFornecedor

roteador.get('/', async (requisicao, resposta) => {
  const resultados = await TabelaFornecedor.listar()
  const Serializador = new SerealizadorFornecedor(resposta.getHeader('ContentType'))
  resposta
    .status(200)
    .send(Serializador.serealizar(resultados))
})

roteador.post('/', async (requisicao, resposta, proximo) => {
  try {
    const dadosRecebidos = requisicao.body
    const fornecedor = new Fornecedor(dadosRecebidos)
    await fornecedor.criar()
    resposta.status(201)
    const Serializador = new SerealizadorFornecedor(resposta.getHeader('ContentType'))
    resposta.send(Serializador.serealizar(fornecedor))
  } catch (err) {
    proximo(err) // Trata o erro no index principal da api
  }
})

roteador.get('/:id', async (requisicao, resposta, proximo) => {
  try {
    const id = requisicao.params.id
    const fornecedor = new Fornecedor({ id: id })
    await fornecedor.carregar()
    resposta.status(200)
    const Serializador = new SerealizadorFornecedor(resposta.getHeader('ContentType'),
      ['email', 'dataCriacao', 'dataAtualizacao', 'versao'])
    resposta.send(Serializador.serealizar(fornecedor))
  } catch (err) {
    proximo(err) // Trata o erro no index principal da api
  }
})

roteador.put('/:id', async (requisicao, resposta, proximo) => {
  try {
    const id = requisicao.params.id
    const dadosRecebidos = requisicao.body
    const dados = Object.assign({}, dadosRecebidos, { id: id })
    const fornecedor = new Fornecedor(dados)
    await fornecedor.atualizar()
    resposta.status(204)
    const Serializador = new SerealizadorFornecedor(resposta.getHeader('ContentType'))
    resposta.send(Serializador.serealizar(fornecedor))
  } catch (err) {
    proximo(err) // Trata o erro no index principal da api
  }
})

roteador.delete('/:id', async (requisicao, resposta, proximo) => {
  try {
    const id = requisicao.params.id
    const fornecedor = new Fornecedor({ id: id })
    await fornecedor.carregar()
    await fornecedor.remover()
    resposta.status(204)
    resposta.end()
  } catch (err) {
    proximo(err)
  }
})

const roteadorProdutos = require('../produtos/')

const verificarFornecedor = async (requisicao, resposta, proximo) => {
  try {
    const id = requisicao.params.id
    const fornecedor = new Fornecedor({ id: id })
    await fornecedor.carregar()
    requisicao.fornecedor = fornecedor
    proximo()
  } catch (erro) {
    proximo(erro)
  }
}

roteador.use('/:id/produtos', verificarFornecedor, roteadorProdutos)

module.exports = roteador
