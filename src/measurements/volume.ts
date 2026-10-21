import type { VolumeUnit } from '../types.js'
import { formatMeasure, type MeasurementFormatOptions } from './scale.js'

const factors: Record<VolumeUnit, number> = {
  ml: 1,
  l: 1000,
  'fl oz': 29.5735296,
}

const autoScale: Partial<Record<VolumeUnit, [number, VolumeUnit]>> = {
  ml: [1000, 'l'],
}

export function convert(value: number, from: VolumeUnit, to: VolumeUnit): number {
  if (!isFinite(value)) return NaN
  return value * factors[from] / factors[to]
}

export function format(
  value: number,
  unit: VolumeUnit,
  options?: MeasurementFormatOptions,
): string {
  return formatMeasure(value, unit, factors, autoScale, options)
}
