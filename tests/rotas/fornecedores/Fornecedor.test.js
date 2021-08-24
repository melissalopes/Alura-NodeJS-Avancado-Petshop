jest.mock('../../../rotas/fornecedores/TabelaFornecedor')
const Fornecedor = require('../../../rotas/fornecedores/Fornecedor')

describe('classe Fornecedor', () => {
  // Teste um
  test('O método validar() retorna true', () => {
    // Istancia a classe Fornecedor pra usar no método
    const fornecedor = new Fornecedor({
      empresa: 'Gatito',
      email: 'contato@gatito.com.br',
      categoria: 'brinquedo'
    })

    expect(fornecedor.validar()).toBe(true)
  })

  // Teste dois
  test('O método criar() foi executado com sucesso', async () => {
    // Istancia a classe Fornecedor pra usar no método
    const fornecedor = new Fornecedor({
      empresa: 'Gatito',
      email: 'contato@gatito.com.br',
      categoria: 'brinquedo'
    })

    await fornecedor.criar()

    expect(fornecedor.id).toBe(500)
    expect(fornecedor.dataCriacao).toBe('10/12/2021')
    expect(fornecedor.dataAtualizacao).toBe('10/12/2021')
    expect(fornecedor.versao).toBe(90)
  })
})
