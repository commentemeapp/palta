import type { LengthUnit } from '../types.js'
import { formatMeasure, type MeasurementFormatOptions } from './scale.js'

const factors: Record<LengthUnit, number> = {
  mm: 1,
  cm: 10,
  m: 1000,
  km: 1_000_000,
  in: 25.4,
  ft: 304.8,
}

const autoScale: Partial<Record<LengthUnit, [number, LengthUnit]>> = {
  cm: [100, 'm'],
}

export function convert(value: number, from: LengthUnit, to: LengthUnit): number {
  if (!isFinite(value)) return NaN
  return value * factors[from] / factors[to]
}

export function format(
  value: number,
  unit: LengthUnit,
  options?: MeasurementFormatOptions,
): string {
  return formatMeasure(value, unit, factors, autoScale, options)
}
