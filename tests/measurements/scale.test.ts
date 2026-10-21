import { describe, it, expect } from 'vitest'
import * as length from '../../src/measurements/length.js'
import * as weight from '../../src/measurements/weight.js'
import * as volume from '../../src/measurements/volume.js'

describe('measurements — auto-escala, sinal e separadores', () => {
  describe('arredondamento na fronteira', () => {
    it('999,999 g arredonda para 1000 e escala para kg', () => {
      expect(weight.format(999.999, 'g')).toBe('1,00 kg')
    })
    it('99,999 cm escala para m', () => {
      expect(length.format(99.999, 'cm')).toBe('1,00 m')
    })
    it('999,994 ml não escala', () => {
      expect(volume.format(999.994, 'ml')).toBe('999,99 ml')
    })
    it('com decimals: 0, 999,6 g já vira 1 kg', () => {
      expect(weight.format(999.6, 'g', { decimals: 0 })).toBe('1 kg')
    })
  })

  describe('valores negativos', () => {
    it('-2000 g escala para kg', () => {
      expect(weight.format(-2000, 'g')).toBe('-2,00 kg')
    })
    it('-150 cm escala para m', () => {
      expect(length.format(-150, 'cm')).toBe('-1,50 m')
    })
    it('-500 ml não escala', () => {
      expect(volume.format(-500, 'ml')).toBe('-500 ml')
    })
    it('-1,5 kg mantém decimais', () => {
      expect(weight.format(-1.5, 'kg')).toBe('-1,50 kg')
    })
    it('negativo que arredonda para zero não mostra sinal', () => {
      expect(weight.format(-0.001, 'kg')).toBe('0,00 kg')
    })
  })

  describe('separador de milhar', () => {
    it('150000 cm → 1.500,00 m', () => {
      expect(length.format(150000, 'cm')).toBe('1.500,00 m')
    })
    it('inteiro sem escala também agrupa', () => {
      expect(length.format(12000, 'mm')).toBe('12.000 mm')
    })
    it('2500000 g → 2.500,00 kg', () => {
      expect(weight.format(2500000, 'g')).toBe('2.500,00 kg')
    })
  })

  describe('decimalSeparator', () => {
    it('ponto como decimal e vírgula como milhar', () => {
      expect(weight.format(1500, 'g', { decimalSeparator: '.' })).toBe('1.50 kg')
      expect(length.format(150000, 'cm', { decimalSeparator: '.' })).toBe('1,500.00 m')
    })
    it('vírgula explícita equivale ao padrão', () => {
      expect(volume.format(1500, 'ml', { decimalSeparator: ',' })).toBe('1,50 l')
    })
    it('inteiro com ponto agrupa com vírgula', () => {
      expect(length.format(12000, 'mm', { decimalSeparator: '.' })).toBe('12,000 mm')
    })
  })

  it('valores que não são number retornam vazio', () => {
    const format = weight.format as (value: unknown, unit: 'g') => string
    expect(format(null, 'g')).toBe('')
    expect(format('1000', 'g')).toBe('')
  })
})
