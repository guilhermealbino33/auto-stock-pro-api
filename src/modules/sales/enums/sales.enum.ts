export enum SaleStatusEnum {
  NEGOCIANDO = 'negociando',
  PAGAMENTO_PENDENTE = 'pagamento_pendente',
  PAGAMENTO_REALIZADO = 'pagamento_realizado',
  AGUARDANDO_APROVACAO_CADASTRO = 'aguardando_aprovacao_cadastro',
  AGUARDANDO_APROVACAO_VENDA = 'aguardando_aprovacao_venda',
  COMPLETO = 'completo',
  CANCELADO = 'cancelado',
}

export enum SalePaymentMethodEnum {
  A_VISTA = 'a_vista',
  A_PRAZO = 'a_prazo',
  CONSORCIO = 'consorcio',
  FINANCIAMENTO = 'financiamento',
  CARRO_MAIS_PRAZO = 'carro_mais_prazo',
  CARRO_MAIS_FINANCIAMENTO = 'carro_mais_financiamento',
  CARRO_MAIS_A_VISTA = 'carro_mais_a_vista',
  CARRO_MAIS_A_CONSORCIO = 'carro_mais_a_consorcio',
  OUTRO = 'outro',
}
