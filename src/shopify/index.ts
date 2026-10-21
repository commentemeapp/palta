import * as ar from '../ar/index.js'
import * as bo from '../bo/index.js'
import * as br from '../br/index.js'
import * as cl from '../cl/index.js'
import * as co from '../co/index.js'
import * as cr from '../cr/index.js'
import * as cu from '../cu/index.js'
import * as do_ from '../do/index.js'
import * as ec from '../ec/index.js'
import * as gt from '../gt/index.js'
import * as hn from '../hn/index.js'
import * as ht from '../ht/index.js'
import * as jm from '../jm/index.js'
import * as mx from '../mx/index.js'
import * as ni from '../ni/index.js'
import * as pa from '../pa/index.js'
import * as pe from '../pe/index.js'
import * as pr from '../pr/index.js'
import * as py from '../py/index.js'
import * as sv from '../sv/index.js'
import * as tt from '../tt/index.js'
import * as uy from '../uy/index.js'
import * as ve from '../ve/index.js'
import { format as formatWeightIn } from '../measurements/weight.js'
import type { CurrencyModule, PhoneModule, WeightUnit, ZipcodeModule } from '../types.js'
import type { MeasurementFormatOptions } from '../measurements/scale.js'

// Shopify identifica países pelo ISO 3166-1 alpha-2 (localization.country.iso_code, CountryCode)
const countries = {
  AR: ar, BO: bo, BR: br, CL: cl, CO: co, CR: cr, CU: cu, DO: do_, EC: ec, GT: gt, HN: hn, HT: ht,
  JM: jm, MX: mx, NI: ni, PA: pa, PE: pe, PR: pr, PY: py, SV: sv, TT: tt, UY: uy, VE: ve,
} as const

export type CountryCode = keyof typeof countries

export interface CountryModule {
  currency: CurrencyModule
  phone: PhoneModule
  zipcode: ZipcodeModule
}

/** MoneyV2 da Storefront API / Hydrogen: `amount` chega como string decimal. */
export interface ShopifyMoney {
  amount: string | number
  currencyCode: string
}

/** Weight da Admin API: REST usa `g`/`kg`/`lb`/`oz`, GraphQL usa `GRAMS`/`KILOGRAMS`/`OUNCES`/`POUNDS`. */
export interface ShopifyWeight {
  value: number
  unit: string
}

export interface MoneyFormatOptions {
  decimals?: number
  symbol?: boolean
  /** País da loja, para desempatar moedas compartilhadas como USD. */
  country?: string
}

function isCountryCode(iso: string): iso is CountryCode {
  return Object.prototype.hasOwnProperty.call(countries, iso)
}

function normalize(v: unknown): string {
  return typeof v === 'string' ? v.trim().toUpperCase() : ''
}

export function byCountry<K extends CountryCode>(iso: K): (typeof countries)[K]
export function byCountry(iso: string): CountryModule | undefined
export function byCountry(iso: string): CountryModule | undefined {
  const key = normalize(iso)
  return isCountryCode(key) ? countries[key] : undefined
}

/**
 * Módulo de moeda pelo código ISO 4217 (`currencyCode` do Shopify).
 * USD é usado por Equador, El Salvador e Porto Rico: passe `country` para escolher o
 * formato local; sem ele, usa o de Equador (`$1,234.50`).
 */
export function byCurrency(code: string, country?: string): CurrencyModule | undefined {
  const currencyCode = normalize(code)
  if (!currencyCode) return undefined
  const preferred = byCountry(normalize(country))
  if (preferred && preferred.currency.code === currencyCode) return preferred.currency
  for (const iso of Object.keys(countries) as CountryCode[]) {
    if (countries[iso].currency.code === currencyCode) return countries[iso].currency
  }
  return undefined
}

/**
 * Converte a unidade mínima do Shopify (Liquid `product.price`, `/cart.js`) em unidade da moeda.
 * O Shopify multiplica por 100 inclusive moedas sem centavos: CLP 10.990 chega como 1099000.
 */
export function fromCents(cents: number): number {
  if (typeof cents !== 'number' || !isFinite(cents)) return NaN
  return cents / 100
}

export function formatMoney(money: ShopifyMoney, options?: MoneyFormatOptions): string {
  if (!money || typeof money !== 'object') return ''
  const module = byCurrency(money.currencyCode, options?.country)
  if (!module) return ''
  const raw = money.amount
  const amount = typeof raw === 'number' ? raw : typeof raw === 'string' && raw.trim() ? Number(raw) : NaN
  return module.format(amount, options)
}

export function formatCents(cents: number, currencyCode: string, options?: MoneyFormatOptions): string {
  return formatMoney({ amount: fromCents(cents), currencyCode }, options)
}

const weightUnits: Record<string, WeightUnit> = {
  G: 'g', GRAMS: 'g',
  KG: 'kg', KILOGRAMS: 'kg',
  OZ: 'oz', OUNCES: 'oz',
  LB: 'lb', POUNDS: 'lb',
}

export function weightUnit(unit: string): WeightUnit | undefined {
  const key = normalize(unit)
  return Object.prototype.hasOwnProperty.call(weightUnits, key) ? weightUnits[key] : undefined
}

/**
 * Formata um Weight do Shopify. Métricos são normalizados para gramas antes de formatar,
 * para que a auto-escala decida entre g e kg (0,5 kg → '500 g').
 */
export function formatWeight(value: ShopifyWeight, options?: MeasurementFormatOptions): string {
  if (!value || typeof value !== 'object' || typeof value.value !== 'number') return ''
  const unit = weightUnit(value.unit)
  if (!unit) return ''
  // toFixed(6) absorve o ruído de ponto flutuante: 1.1 kg → 1100 g, não 1100.0000000000002
  if (unit === 'kg') return formatWeightIn(Number((value.value * 1000).toFixed(6)), 'g', options)
  return formatWeightIn(value.value, unit, options)
}
