# 🥑 Cómo contribuir a palta

¡Gracias por tu interés en contribuir! Este es un proyecto open source creado por [zeluizr](https://github.com/zeluizr) en asociación con [commente.me](https://commente.me).


## Antes de empezar

- Busca si ya existe un issue o PR para lo que quieres hacer
- Para cambios grandes, abre un issue primero para discutirlo
- Lee las reglas del proyecto al final de este documento

---

## Setup local

```bash
git clone https://github.com/commentemeapp/palta.git
cd palta
npm install
npm test
```

---

## Flujo de contribución

1. Fork del repositorio
2. Crea una branch descriptiva:
   ```bash
   git checkout -b feat/uy-rut        # nuevo país/módulo
   git checkout -b fix/br-cpf-mask    # corrección de bug
   git checkout -b docs/readme-update # documentación
   ```
3. Implementa tu cambio siguiendo las reglas del proyecto
4. Asegúrate de que los tests pasan:
   ```bash
   npm test
   npm run test:coverage  # cobertura mínima: 94%
   ```
5. Abre un Pull Request hacia `main`

---

## Agregar un nuevo país

Estructura requerida para cada país `XX`:

```
src/XX/
  cpf.ts        # o el documento fiscal correspondiente
  currency.ts
  phone.ts
  zipcode.ts
  index.ts      # exporta todos los módulos del país

tests/XX/
  cpf.test.ts
  currency.test.ts
  phone.test.ts
  zipcode.test.ts
```

Pasos:

1. Crea `src/XX/` implementando las interfaces de `src/types.ts`
2. Crea `src/XX/index.ts` exportando todos los módulos
3. Agrega `export * as xx from './XX/index.js'` en `src/index.ts`
4. Agrega el entry en `tsup.config.ts`:
   ```ts
   entry: { ..., 'xx/index': 'src/XX/index.ts' }
   ```
5. Agrega el export en `package.json`:
   ```json
   "./xx": {
     "types": "./dist/xx/index.d.ts",
     "import": "./dist/xx/index.js",
     "require": "./dist/xx/index.cjs"
   }
   ```
6. Crea los tests en `tests/XX/` con cobertura ≥ 94%

---

## Interfaces a implementar

```ts
// Documento fiscal
interface Document {
  format(value: string): string
  strip(value: string): string
  validate(value: string): boolean
  mask: string
}

// Moneda
interface Currency {
  format(value: number, options?: { decimals?: number; symbol?: boolean }): string
  parse(value: string): number
  symbol: string
  code: string
}

// Teléfono
interface Phone {
  format(value: string, options?: { international?: boolean }): string
  validate(value: string): boolean
  mask: string | { mobile: string; landline: string }
  countryCode: string
}

// Código postal
interface Zipcode {
  format(value: string): string
  validate(value: string): boolean
  mask: string
}
```

---

## Reglas del proyecto

| Regla | Descripción |
|-------|-------------|
| Zero dependencias | Sin dependencias de runtime |
| TypeScript strict | Sin `any`, tipos explícitos |
| Funciones puras | Sin mutación de estado externo |
| Defensivo | Manejar `null`/`undefined` sin lanzar excepciones |
| Cobertura ≥ 94% | Verificar con `npm run test:coverage` |
| Sin efectos secundarios | `"sideEffects": false` en package.json |

---

## Licencia

Al contribuir, aceptas que tu código se publique bajo la licencia [MIT](../LICENSE).
