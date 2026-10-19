<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/zeluizr/palta/main/.github/assets/readme-header-dark.png">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/zeluizr/palta/main/assets/banner.png">
  <img alt="palta — Formateo y validación de datos de América Latina: CPF, CNPJ, RUT, CUIT, NIT, RUC, monedas, teléfonos y códigos postales. 23 países, TypeScript, cero dependencias, ESM + CJS, Node >=16, MIT." src="https://raw.githubusercontent.com/zeluizr/palta/main/assets/banner.png" width="100%">
</picture>

# palta

**Formateo y validación de datos de América Latina — CPF, CNPJ, RUT, CUIT, NIT, RUC, monedas, teléfonos y códigos postales. Cero dependencias.**

Librería TypeScript para 23 países de América Latina. Formatea, valida, limpia y enmascara
documentos de identidad y tributarios; formatea y parsea monedas, teléfonos y códigos postales;
y convierte medidas con auto-escala. Sin dependencias en runtime, ESM y CJS, tipos incluidos.

[![npm](https://badgen.net/npm/v/@zeluizr/palta?color=7AB317)](https://www.npmjs.com/package/@zeluizr/palta)
[![node](https://badgen.net/npm/node/@zeluizr/palta)](https://nodejs.org)
[![licencia](https://badgen.net/npm/license/@zeluizr/palta?label=licencia)](./LICENSE)

---

## Instalación

```bash
npm i @zeluizr/palta
```

## Uso

Cada país es un namespace de dos letras. Dentro de cada uno, los módulos siempre tienen la
misma forma: `format`, `validate`, `strip`, `mask` para documentos; `format`, `parse`,
`symbol`, `code` para moneda.

```ts
import { br, cl, ar } from '@zeluizr/palta'

// Documentos
br.cpf.format('11144477735')        // '111.444.777-35'
br.cpf.validate('111.444.777-35')   // true
br.cpf.strip('111.444.777-35')      // '11144477735'
br.cpf.mask                         // '###.###.###-##'

cl.rut.format('123456785')          // '12.345.678-5'
ar.cuit.validate('20123456786')     // true
```

```ts
// Moneda — formato local, con o sin símbolo
br.currency.format(1234.5)                    // 'R$ 1.234,50'
br.currency.format(1234.5, { symbol: false }) // '1.234,50'
br.currency.parse('R$ 1.234,50')              // 1234.5
```

```ts
// Teléfonos y códigos postales
cl.phone.format('912345678')        // '+56 9 1234 5678'  (internacional por defecto)
br.phone.format('11987654321')      // '(11) 98765-4321'  (Brasil es la excepción: nacional)
br.phone.format('11987654321', { international: true })   // '+55 (11) 98765-4321'
br.zipcode.format('01310100')       // '01310-100'
```

```ts
import { measurements } from '@zeluizr/palta'

// Medidas — auto-escala (cm >= 100 -> m, g >= 1000 -> kg, ml >= 1000 -> l)
measurements.length.format(150, 'cm')   // '1,50 m'
measurements.weight.format(2500, 'g')   // '2,50 kg'
measurements.length.convert(1, 'm', 'cm')  // 100
```

Pensado para VTEX IO, que entrega dimensiones en `cm` y peso en `g`: `format()` escala solo
para mostrar y nunca altera el valor original.

```ts
import { detect } from '@zeluizr/palta'

// Detección — identifica país y tipo a partir del valor
detect('111.444.777-35')
// -> { country: 'BR', type: 'cpf', valid: true, formatted: '111.444.777-35' }
```

`detect()` cubre los documentos principales (CPF, CNPJ, RUT, CUIT, DNI, CC, NIT, RUC, RFC,
CURP, RIF, CI) y devuelve `null` cuando no reconoce el valor. No es exhaustiva entre los 23
países.

Para reducir el bundle, cada país se puede importar por subpath:

```ts
import { cpf, currency } from '@zeluizr/palta/br'
import { length } from '@zeluizr/palta/measurements'
```

## Referencia

Versión del código: **1.3.1**, según [package.json](package.json). El inventario de
países está en [src/index.ts](src/index.ts); los contratos de los módulos están en
[src/types.ts](src/types.ts) y los cambios de API en [CHANGELOG.md](CHANGELOG.md).

La validación comprueba las reglas implementadas para cada documento (formato y, cuando
corresponde, dígito verificador). No consulta registros fiscales ni verifica la identidad
de una persona. La detección automática tampoco sustituye el país elegido por el usuario.

Cada namespace de país exporta `currency`, `phone`, `zipcode` y uno o dos documentos. Los
contratos están en `src/types.ts` y son idénticos en todos los países.

| módulo | exporta | notas |
|---|---|---|
| documento | `format` `strip` `validate` `mask` | `mask` es la plantilla, por ejemplo `###.###.###-##` |
| `currency` | `format` `parse` `symbol` `code` | `format(value, { decimals, symbol })` |
| `phone` | `format` `validate` `mask` `countryCode` | `format(value, { international })` — internacional por defecto en todos los países **menos Brasil**, que devuelve el formato nacional salvo que se pida `{ international: true }` |
| `zipcode` | `format` `validate` `mask` | |

<details>
<summary>Los 23 países y sus documentos</summary>

| subpath | país | documentos |
|---|---|---|
| `./ar` | Argentina | `cuit` `dni` |
| `./bo` | Bolivia | `ci` `nit` |
| `./br` | Brasil | `cpf` `cnpj` |
| `./cl` | Chile | `rut` |
| `./co` | Colombia | `cc` `nit` |
| `./cr` | Costa Rica | `cedula` `dimex` `juridica` |
| `./cu` | Cuba | `ni` `reeup` |
| `./do` | República Dominicana | `cedula` `rnc` |
| `./ec` | Ecuador | `ci` `ruc` |
| `./gt` | Guatemala | `dpi` `nit` |
| `./hn` | Honduras | `dni` `rtn` |
| `./ht` | Haití | `cin` `nif` |
| `./jm` | Jamaica | `nin` `trn` |
| `./mx` | México | `curp` `rfc` |
| `./ni` | Nicaragua | `cedula` `ruc` |
| `./pa` | Panamá | `cedula` `ruc` |
| `./pe` | Perú | `dni` `ruc` |
| `./pr` | Puerto Rico | `ein` `ssn` |
| `./py` | Paraguay | `ci` `ruc` |
| `./sv` | El Salvador | `dui` `nit` |
| `./tt` | Trinidad y Tobago | `nis` `tin` |
| `./uy` | Uruguay | `ci` `rut` |
| `./ve` | Venezuela | `ci` `rif` |

En el import raíz, República Dominicana se expone como `do_` porque `do` es palabra reservada
de JavaScript. El subpath sigue siendo `@zeluizr/palta/do`.

</details>

| export global | subpath | qué hace |
|---|---|---|
| `detect` | `.` | identifica país y tipo de un documento; `null` si no lo reconoce |
| `measurements.length` | `./measurements` | `mm` `cm` `m` `km` `in` `ft` |
| `measurements.weight` | `./measurements` | `mg` `g` `kg` `oz` `lb` |
| `measurements.volume` | `./measurements` | `ml` `l` `fl oz` |

## Requisitos

- Node `>= 16` en runtime
- ESM y CJS, con tipos incluidos
- Sin dependencias en runtime

El toolchain de desarrollo pide más: vitest exige Node `>= 18` y la CI corre en Node 22. Esa
diferencia importa en VTEX IO — el paquete instala y corre en Node 16 igual, porque la salida
compilada no usa ninguna API exclusiva de versiones nuevas.

## Estructura

```
.
├── src/
│   ├── [pais]/           # un directorio por país
│   │   ├── index.ts      # re-exporta los submódulos
│   │   ├── [documento].ts
│   │   ├── currency.ts
│   │   ├── phone.ts
│   │   └── zipcode.ts
│   ├── measurements/     # length, weight, volume
│   ├── detect.ts
│   ├── types.ts          # contratos compartidos
│   └── utils.ts
├── tests/                # espejo de src/, un archivo por módulo
├── demo/index.html
├── tsup.config.ts
└── vitest.config.ts
```

## Desarrollo

```bash
git clone https://github.com/zeluizr/palta.git
cd palta
npm install

npm test              # vitest
npm run test:coverage # cobertura, umbral 94%
npm run lint          # tsc --noEmit, única puerta estática
npm run build         # tsup: ESM + CJS + .d.ts
```

Los tests importan directo de `src/`, así que corren sin haber hecho `build`. La CI
(`.github/workflows/ci.yml`) corre lint, cobertura y build en cada push y PR contra `main`.

Para agregar un país nuevo hay que tocar cinco lugares, en este orden:

1. `src/xx/index.ts` re-exportando los submódulos
2. `export * as xx from './xx/index.js'` en `src/index.ts`
3. entrada en `tsup.config.ts`
4. entrada en `exports` de `package.json`
5. tests en `tests/xx/` con cobertura mínima de 94%

Publicar es manual: `npm run publish:npm` para npm, `npm run publish:all` para npm y GitHub
Packages. `prepublishOnly` corre lint, tests y build antes de subir nada.

## Contribuir

Reglas que no se negocian: cero dependencias en runtime, TypeScript estricto sin `any`,
funciones puras y defensivas — `format('')`, `validate(null)` y `strip(undefined)` nunca
pueden lanzar. La cobertura no puede bajar de 94%.

Conventional Commits; el mensaje describe el efecto, no el cambio. Abrir un issue antes de
cualquier cambio que no sea una corrección pequeña.

## Licencia

[MIT](./LICENSE)

_Hecho con amor y café por [zeluizr](https://github.com/zeluizr) y con la ayuda de [Claude](https://claude.ai/referral/Cz_UimA0NQ) ☕_
