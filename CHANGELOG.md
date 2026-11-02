# Changelog

Todos los cambios notables de este proyecto se documentan en este archivo.

El formato se basa en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/)
y este proyecto sigue el [Versionado Semántico](https://semver.org/lang/es/).

## [1.4.0] - 2026-10-29

### Cambiado
- El paquete pasa a llamarse `@commenteme/palta`. `@zeluizr/palta` queda en 1.3.1 y se
  descontinúa: para migrar, cambia el nombre en `package.json` y en los imports. La API no cambia.
- El repositorio pasa a `github.com/commentemeapp/palta`.
- Se quitan los scripts `publish:gh`, `publish:all` y `postversion`. GitHub Packages exige que el
  scope sea el dueño del repositorio, y `postversion` empujaba directo a `main`.
- La demo importa `@commenteme/palta@1` en lugar de `@latest`.
- El README corrige la versión de Node que pide vitest 4.
- El README suma una sección Shopify con ejemplos en Liquid y Hydrogen.

### Corregido
- `measurements.format` decide la auto-escala con el valor ya redondeado: `weight.format(999.999, 'g')`
  devuelve `'1,00 kg'` y no `'1000,00 g'`.
- `measurements.format` auto-escala también los negativos: `weight.format(-2000, 'g')` devuelve
  `'-2,00 kg'`.
- `measurements.format` agrupa los miles: `length.format(150000, 'cm')` devuelve `'1.500,00 m'`.

### Añadido
- `measurements.format` acepta `decimalSeparator: ',' | '.'` (por defecto `','`). Con `'.'` los
  miles se separan con `','`, como en México, Puerto Rico o República Dominicana.
- Build IIFE minificado `dist/palta.global.js` (~12 KB gzip) que expone `window.palta`, para usar
  con `<script>` sin bundler. Los campos `unpkg` y `jsdelivr` de `package.json` apuntan a él.
- Módulo `shopify` (`@commenteme/palta/shopify`, y `shopify` en el import raíz y en `window.palta`):
  - `byCountry(iso)` — namespace del país por ISO 3166-1 (`'DO'` resuelve a `do_`).
  - `byCurrency(code, country?)` — `CurrencyModule` por ISO 4217; `country` desempata USD.
  - `fromCents(cents)` — unidad mínima de Liquid y `/cart.js` a unidad de moneda (÷100 también
    en CLP, PYG y COP, como hace Shopify).
  - `formatMoney(MoneyV2, options)` y `formatCents(cents, currencyCode, options)`.
  - `weightUnit(unit)` y `formatWeight({ value, unit })` — unidades REST (`g`, `kg`, `lb`, `oz`)
    y del enum GraphQL (`GRAMS`, `KILOGRAMS`, `OUNCES`, `POUNDS`).

## [1.3.1] - 2026-09-15

### Cambiado
- El README abre con un banner (`assets/banner.png`). Se referencia por URL absoluta porque
  npm no resuelve rutas relativas ni renderiza HTML crudo. El archivo no entra en el paquete:
  `files` sigue siendo `["dist"]`.

## [1.3.0] - 2026-09-10

### Corregido
- `mx.currency` implementa `parse(value): number`, como manda `CurrencyModule`. `strip` se
  conserva como extra, así que nada se rompe para quien ya lo usaba
  ([#61](https://github.com/commentemeapp/palta/issues/61)).
- `ni.phone` expone `countryCode`. `code` queda como alias deprecado
  ([#62](https://github.com/commentemeapp/palta/issues/62)).
- `currency.format` devuelve `''` con cualquier valor no finito en los 23 países, la misma
  política de `measurements.format`. Antes lanzaba `TypeError` en Puerto Rico y devolvía un
  `NaN` renderizado en el resto ([#63](https://github.com/commentemeapp/palta/issues/63)).
- `currency.format` respeta `decimals` y `symbol` en Haití, México y Puerto Rico
  ([#64](https://github.com/commentemeapp/palta/issues/64)).
- `ht.currency.parse` y `pr.currency.parse` dejan de lanzar con `null`, `undefined` o
  valores que no son string.

### Añadido
- `tests/types.test.ts`: verifica los contratos de `src/types.ts` en los 23 países, para que
  un desvío de contrato no vuelva a pasar desapercibido.
- La CI corre también en `dev` y `qa`, no solo en `main`.
- Estandarización del README (badges de badgen, contenido en español).
- Archivo `LICENSE` (MIT) y este `CHANGELOG`.

## [1.2.0] - 2026-06-04

### Añadido
- Versión inicial del proyecto.
