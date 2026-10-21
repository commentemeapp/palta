export interface MeasurementFormatOptions {
  decimals?: number
  decimalSeparator?: ',' | '.'
}

function group(abs: number, decimals: number | undefined, sep: ',' | '.'): string {
  const thousands = sep === ',' ? '.' : ','
  const fixed = decimals === undefined ? String(abs) : abs.toFixed(decimals)
  const [intPart, decPart] = fixed.split('.')
  const intFormatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousands)
  return decPart ? `${intFormatted}${sep}${decPart}` : intFormatted
}

export function formatMeasure<U extends string>(
  value: number,
  unit: U,
  factors: Record<U, number>,
  autoScale: Partial<Record<U, [number, U]>>,
  options?: MeasurementFormatOptions,
): string {
  if (typeof value !== 'number' || !isFinite(value)) return ''
  const d = options?.decimals ?? 2
  const sep = options?.decimalSeparator ?? ','
  const abs = Math.abs(value)
  const scale = autoScale[unit]
  // Compara o valor já arredondado: 999,999 g vira "1000,00" e deve escalar para kg
  if (scale && Number(abs.toFixed(d)) >= scale[0]) {
    const scaled = (abs * factors[unit]) / factors[scale[1]]
    const sign = value < 0 && Number(scaled.toFixed(d)) !== 0 ? '-' : ''
    return `${sign}${group(scaled, d, sep)} ${scale[1]}`
  }
  const integer = options?.decimals === undefined && Number.isInteger(value)
  const sign = value < 0 && (integer || Number(abs.toFixed(d)) !== 0) ? '-' : ''
  return `${sign}${group(abs, integer ? undefined : d, sep)} ${unit}`
}
