
module.exports = {

  listar () {
    return []
  },

  inserir (fornecedor) {
    return {
      id: 500,
      dataCriacao: '10/12/2021',
      dataAtualizacao: '10/12/2021',
      versao: 90
    }
  },

  async pegarPorId (id) {
    return {
      id: 500,
      dataCriacao: '10/12/2021',
      dataAtualizacao: '10/12/2021',
      versao: 90
    }
  },

  async atualizar (id, dadosParaAtualizar) {
  },

  remover (id) {
  }
}
