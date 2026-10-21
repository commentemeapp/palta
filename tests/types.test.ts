import { describe, it, expect } from 'vitest'
import * as palta from '../src/index.js'

type Module = Record<string, unknown>
type Country = Record<string, Module>

const countries = Object.entries(palta as unknown as Record<string, unknown>)
  .filter(([name]) => !['detect', 'measurements', 'shopify'].includes(name))
  .map(([name, country]) => [name, country as Country] as [string, Country])

const noFinitos = [NaN, Infinity, -Infinity, null, undefined]
const noStrings = [null, undefined, 123, {}]

describe('contratos de src/types.ts', () => {
  it('cubre los 23 países', () => {
    expect(countries).toHaveLength(23)
  })

  for (const [name, country] of countries) {
    describe(name, () => {
      it('currency implementa CurrencyModule', () => {
        expect(typeof country.currency.format).toBe('function')
        expect(typeof country.currency.parse).toBe('function')
        expect(typeof country.currency.symbol).toBe('string')
        expect(typeof country.currency.code).toBe('string')
      })

      it('currency.format devuelve "" con valores no finitos', () => {
        const format = country.currency.format as (value: unknown) => string
        for (const valor of noFinitos) expect(format(valor)).toBe('')
      })

      it('currency.format respeta options', () => {
        const format = country.currency.format as (
          value: number,
          options?: { decimals?: number; symbol?: boolean },
        ) => string
        const symbol = country.currency.symbol as string
        expect(format(1234.5, { symbol: false })).not.toContain(symbol)
        expect(format(1234.5, { decimals: 0 })).not.toMatch(/[.,]\d\d$/)
      })

      it('currency.parse no lanza con entradas que no son string', () => {
        const parse = country.currency.parse as (value: unknown) => number
        for (const valor of noStrings) {
          expect(() => parse(valor)).not.toThrow()
          expect(typeof parse(valor)).toBe('number')
        }
      })

      it('phone implementa PhoneModule', () => {
        expect(typeof country.phone.format).toBe('function')
        expect(typeof country.phone.validate).toBe('function')
        expect(typeof country.phone.countryCode).toBe('string')
        expect(['string', 'object']).toContain(typeof country.phone.mask)
      })

      it('zipcode implementa ZipcodeModule', () => {
        expect(typeof country.zipcode.format).toBe('function')
        expect(typeof country.zipcode.validate).toBe('function')
        expect(typeof country.zipcode.mask).toBe('string')
      })

      it('los documentos son defensivos', () => {
        for (const [submodulo, mod] of Object.entries(country)) {
          if (submodulo === 'currency' || submodulo === 'phone' || submodulo === 'zipcode') continue
          const format = mod.format as (value: unknown) => string
          const strip = mod.strip as (value: unknown) => string
          const validate = mod.validate as (value: unknown) => boolean
          expect(format('')).toBe('')
          expect(strip(undefined)).toBe('')
          expect(validate(null)).toBe(false)
        }
      })
    })
  }
})
