import type { WeightUnit } from '../types.js'
import { formatMeasure, type MeasurementFormatOptions } from './scale.js'

const factors: Record<WeightUnit, number> = {
  mg: 1,
  g: 1000,
  kg: 1_000_000,
  oz: 28349.523125,
  lb: 453592.37,
}

const autoScale: Partial<Record<WeightUnit, [number, WeightUnit]>> = {
  g: [1000, 'kg'],
}

export function convert(value: number, from: WeightUnit, to: WeightUnit): number {
  if (!isFinite(value)) return NaN
  return value * factors[from] / factors[to]
}

export function format(
  value: number,
  unit: WeightUnit,
  options?: MeasurementFormatOptions,
): string {
  return formatMeasure(value, unit, factors, autoScale, options)
}
