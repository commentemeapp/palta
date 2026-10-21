import { describe, it, expect } from 'vitest'
import * as shopify from '../../src/shopify/index.js'
import * as br from '../../src/br/index.js'
import * as do_ from '../../src/do/index.js'
import * as pr from '../../src/pr/index.js'
import * as ec from '../../src/ec/index.js'

describe('shopify', () => {
  describe('byCountry', () => {
    it('resolve pelo ISO do Shopify', () => {
      expect(shopify.byCountry('BR')).toBe(br)
      expect(shopify.byCountry('BR').cpf.validate('111.444.777-35')).toBe(true)
    })
    it('DO resolve para do_', () => expect(shopify.byCountry('DO')).toBe(do_))
    it('ignora caixa e espaços', () => expect(shopify.byCountry(' br ')).toBe(br))
    it('país fora da América Latina retorna undefined', () => {
      expect(shopify.byCountry('US')).toBeUndefined()
    })
    it('não confunde com propriedades do Object', () => {
      expect(shopify.byCountry('CONSTRUCTOR')).toBeUndefined()
    })
    it('entradas inválidas retornam undefined', () => {
      const byCountry = shopify.byCountry as (iso: unknown) => unknown
      for (const v of ['', null, undefined, 55]) expect(byCountry(v)).toBeUndefined()
    })
  })

  describe('byCurrency', () => {
    it('resolve pelo código ISO 4217', () => {
      expect(shopify.byCurrency('BRL')).toBe(br.currency)
      expect(shopify.byCurrency('brl')).toBe(br.currency)
    })
    it('USD sem país usa o formato de Equador', () => {
      expect(shopify.byCurrency('USD')).toBe(ec.currency)
    })
    it('USD com país desempata', () => {
      expect(shopify.byCurrency('USD', 'PR')).toBe(pr.currency)
    })
    it('país cuja moeda não bate é ignorado', () => {
      expect(shopify.byCurrency('BRL', 'CL')).toBe(br.currency)
    })
    it('moeda desconhecida retorna undefined', () => {
      expect(shopify.byCurrency('EUR')).toBeUndefined()
      expect(shopify.byCurrency('')).toBeUndefined()
    })
  })

  describe('fromCents', () => {
    it('divide por 100', () => expect(shopify.fromCents(1990)).toBe(19.9))
    it('CLP também vem multiplicado por 100', () => expect(shopify.fromCents(1099000)).toBe(10990))
    it('não finitos retornam NaN', () => {
      const fromCents = shopify.fromCents as (v: unknown) => number
      for (const v of [NaN, Infinity, null, undefined, '1990']) expect(fromCents(v)).toBeNaN()
    })
  })

  describe('formatMoney', () => {
    it('MoneyV2 da Storefront API', () => {
      expect(shopify.formatMoney({ amount: '1234.5', currencyCode: 'BRL' })).toBe('R$ 1.234,50')
    })
    it('aceita amount numérico', () => {
      expect(shopify.formatMoney({ amount: 10990, currencyCode: 'CLP' })).toBe('$10.990')
    })
    it('repassa decimals e symbol', () => {
      expect(shopify.formatMoney({ amount: '1234.5', currencyCode: 'BRL' }, { symbol: false })).toBe('1.234,50')
      expect(shopify.formatMoney({ amount: '1234.5', currencyCode: 'BRL' }, { decimals: 0 })).toBe('R$ 1.235')
    })
    it('usa o país para USD', () => {
      expect(shopify.formatMoney({ amount: '1234.5', currencyCode: 'USD' }, { country: 'PR' })).toBe('$ 1,234.50')
    })
    it('moeda desconhecida ou amount inválido retornam vazio', () => {
      expect(shopify.formatMoney({ amount: '10', currencyCode: 'EUR' })).toBe('')
      expect(shopify.formatMoney({ amount: 'abc', currencyCode: 'BRL' })).toBe('')
      expect(shopify.formatMoney({ amount: '', currencyCode: 'BRL' })).toBe('')
    })
    it('entradas que não são objeto retornam vazio', () => {
      const formatMoney = shopify.formatMoney as (v: unknown) => string
      for (const v of [null, undefined, 'R$ 10']) expect(formatMoney(v)).toBe('')
      expect(formatMoney({ amount: null, currencyCode: 'BRL' })).toBe('')
    })
  })

  describe('formatCents', () => {
    it('preço do Liquid / cart.js', () => {
      expect(shopify.formatCents(199000, 'BRL')).toBe('R$ 1.990,00')
      expect(shopify.formatCents(1099000, 'CLP')).toBe('$10.990')
    })
    it('repassa options', () => {
      expect(shopify.formatCents(123450, 'USD', { country: 'SV' })).toBe('$ 1,234.50')
    })
    it('não finito retorna vazio', () => expect(shopify.formatCents(NaN, 'BRL')).toBe(''))
  })

  describe('weightUnit', () => {
    it('unidades REST e Liquid', () => {
      expect(shopify.weightUnit('g')).toBe('g')
      expect(shopify.weightUnit('kg')).toBe('kg')
      expect(shopify.weightUnit('lb')).toBe('lb')
      expect(shopify.weightUnit('oz')).toBe('oz')
    })
    it('enum WeightUnit do GraphQL', () => {
      expect(shopify.weightUnit('GRAMS')).toBe('g')
      expect(shopify.weightUnit('KILOGRAMS')).toBe('kg')
      expect(shopify.weightUnit('OUNCES')).toBe('oz')
      expect(shopify.weightUnit('POUNDS')).toBe('lb')
    })
    it('desconhecida retorna undefined', () => {
      expect(shopify.weightUnit('stone')).toBeUndefined()
      expect(shopify.weightUnit('toString')).toBeUndefined()
    })
  })

  describe('formatWeight', () => {
    it('gramas com auto-escala', () => {
      expect(shopify.formatWeight({ value: 500, unit: 'GRAMS' })).toBe('500 g')
      expect(shopify.formatWeight({ value: 1500, unit: 'g' })).toBe('1,50 kg')
    })
    it('kg é normalizado para g', () => {
      expect(shopify.formatWeight({ value: 0.5, unit: 'KILOGRAMS' })).toBe('500 g')
      expect(shopify.formatWeight({ value: 1.1, unit: 'kg' })).toBe('1,10 kg')
    })
    it('imperiais mantêm a unidade', () => {
      expect(shopify.formatWeight({ value: 2, unit: 'POUNDS' })).toBe('2 lb')
    })
    it('repassa options', () => {
      expect(shopify.formatWeight({ value: 1500, unit: 'g' }, { decimalSeparator: '.' })).toBe('1.50 kg')
    })
    it('entradas inválidas retornam vazio', () => {
      const formatWeight = shopify.formatWeight as (v: unknown) => string
      expect(formatWeight(null)).toBe('')
      expect(formatWeight({ value: '500', unit: 'g' })).toBe('')
      expect(formatWeight({ value: 500, unit: 'stone' })).toBe('')
    })
  })
})
