const roteador = require('express').Router({ mergeParams: true })
const Tabela = require('./TabelaProduto')
const Produto = require('./Produto')
const SerializadorProduto = require('../../Serializador').SerializadorProduto

roteador.get('/', async (requisicao, resposta) => {
  const produtos = await Tabela.listar(requisicao.fornecedor.id)
  const Serializador = new SerializadorProduto(
    resposta.getHeader('ContentType')
  )
  resposta
    .status(200)
    .send(Serializador.serealizar(produtos))
})

roteador.post('/', async (requisicao, resposta, proximo) => {
  try {
    const idFornecedor = requisicao.fornecedor.id
    const corpo = requisicao.body
    const dados = Object.assign({}, corpo, { fornecedor: idFornecedor })
    const produto = new Produto(dados)
    await produto.criar()
    const Serializador = new SerializadorProduto(
      resposta.getHeader('ContentType')
    )
    resposta.set('ETag', produto.versao)
    const timestamp = (new Date(produto.dataAtualizacao)).getTime()
    resposta.set('Last-Modified', timestamp)
    resposta.set('Location', `/api/fornecedores/${produto.fornecedor}/produtos/${produto.id}`)
    resposta.status(201).send(Serializador.serealizar(produto))
  } catch (err) {
    proximo(err)
  }
})

roteador.delete('/:id', async (requisicao, resposta) => {
  const dados = {
    id: requisicao.params.id,
    fornecedor: requisicao.fornecedor.id
  }

  const produto = new Produto(dados)
  await produto.apagar()
  resposta.status(204)
  resposta.end()
})

roteador.get('/:id', async (requisicao, resposta, proximo) => {
  try {
    const dados = {
      id: requisicao.params.id,
      fornecedor: requisicao.fornecedor.id
    }
    const produto = new Produto(dados)
    await produto.carregar()
    const Serializador = new SerializadorProduto(
      resposta.getHeader('ContentType')
    )
    resposta.set('ETag', produto.versao)
    const timestamp = (new Date(produto.dataAtualizacao)).getTime()
    resposta.set('Last-Modified', timestamp)
    resposta.status(200).send(Serializador.serealizar(produto))
  } catch (err) {
    proximo(err)
  }
})

roteador.head('/:id', async (requisicao, resposta, proximo) => {
  try {
    const dados = {
      id: requisicao.params.id,
      fornecedor: requisicao.fornecedor.id
    }

    const produto = new Produto(dados)
    await produto.carregar()
    resposta.set('ETag', produto.versao)
    const timestamp = (new Date(produto.dataAtualizacao)).getTime()
    resposta.set('Last-Modified', timestamp)
    resposta.status(200)
    resposta.end()
  } catch (erro) {
    proximo(erro)
  }
})

roteador.put('/:id', async (requisicao, resposta, proximo) => {
  try {
    const dados = Object.assign(
      {},
      requisicao.body,
      {
        id: requisicao.params.id,
        fornecedor: requisicao.fornecedor.id
      }
    )

    const produto = new Produto(dados)
    await produto.atualizar()
    await produto.carregar()
    resposta.set('ETag', produto.versao)
    const timestamp = (new Date(produto.dataAtualizacao)).getTime()
    resposta.set('Last-Modified', timestamp)
    resposta.status(204).end()
  } catch (err) {
    proximo(err)
  }
})

roteador.post('/:id/diminuir-estoque', async (requisicao, resposta, proximo) => {
  try {
    const produto = new Produto({
      id: requisicao.params.id,
      fornecedor: requisicao.fornecedor.id
    })

    await produto.carregar()
    produto.estoque = produto.estoque - requisicao.body.quantidade
    await produto.diminuirEstoque()
    await produto.carregar()
    resposta.set('ETag', produto.versao)
    const timestamp = (new Date(produto.dataAtualizacao)).getTime()
    resposta.set('Last-Modified', timestamp)
    resposta.status(204).end()
  } catch (erro) {
    proximo(erro)
  }
})

module.exports = roteador
