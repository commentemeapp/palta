export interface DocumentModule {
  format(value: string): string
  strip(value: string): string
  validate(value: string): boolean
  mask: string
}

export interface CurrencyModule {
  format(value: number, options?: { decimals?: number; symbol?: boolean }): string
  parse(value: string): number
  symbol: string
  code: string
}

export interface PhoneModule {
  format(value: string, options?: { international?: boolean }): string
  validate(value: string): boolean
  mask: string | { mobile: string; landline: string }
  countryCode: string
}

export interface ZipcodeModule {
  format(value: string): string
  validate(value: string): boolean
  mask: string
}

export type LengthUnit = 'mm' | 'cm' | 'm' | 'km' | 'in' | 'ft'
export type WeightUnit = 'mg' | 'g' | 'kg' | 'oz' | 'lb'
export type VolumeUnit = 'ml' | 'l' | 'fl oz'

export interface MeasurementModule<U extends string> {
  convert(value: number, from: U, to: U): number
  format(value: number, unit: U, options?: { decimals?: number; decimalSeparator?: ',' | '.' }): string
}

export interface DetectResult {
  country: string
  type: string
  valid: boolean
  formatted: string
}
