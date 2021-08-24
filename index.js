const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const config = require('config')
const roteador = require('./rotas/fornecedores')
const NaoEncontrado = require('./erros/NaoEncontrado')
const CampoInvalido = require('./erros/CampoInvalido')
const DadosNaoFornecidos = require('./erros/DadosNaoFornecidos')
const ValorNaoSuportado = require('./erros/ValorNaoSuportado')
const formatosAceitos = require('./Serializador').formatosAceitos
const SerializadorErro = require('./Serializador').SerializadorErro

app.use(bodyParser.json())

app.use((requisicao, resposta, proximo) => {
  let formatoRequisitado = requisicao.header('Accept')

  if (formatoRequisitado === '*/*') {
    formatoRequisitado = 'application/json'
  }

  if (formatosAceitos.indexOf(formatoRequisitado) === -1) {
    resposta.status(406).end()
    return
  }

  resposta.setHeader('ContentType', formatoRequisitado)
  proximo()
})

app.use('/api/fornecedores', roteador)

app.use((err, requisicao, resposta, proximo) => {
  let status = 500

  if (err instanceof NaoEncontrado) {
    status = 404
  }

  if (err instanceof CampoInvalido || err instanceof DadosNaoFornecidos) {
    status = 400
  }

  if (err instanceof ValorNaoSuportado) {
    status = 406
  }

  const Serializador = new SerializadorErro(
    resposta.getHeader('ContentType')
  )

  resposta.status(status).send(Serializador.serealizar({
    mensagem: err.message,
    id: err.idErro
  }))
})

app.listen(config.get('api.porta'), () => console.log('Servidor rodando na porta 3000'))
