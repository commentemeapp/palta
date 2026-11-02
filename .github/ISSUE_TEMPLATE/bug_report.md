---
name: 🐛 Bug report
about: Algo no funciona como se espera
title: '[BUG] '
labels: bug
assignees: ''
---

## Descripción

<!-- Describe el problema de forma clara y concisa -->

## Módulo afectado

<!-- Marca el módulo donde ocurre el bug -->

- [ ] `br` — Brasil (CPF, CNPJ, moneda, teléfono, CEP)
- [ ] `cl` — Chile (RUT, moneda, teléfono, código postal)
- [ ] `ar` — Argentina (CUIT, DNI, moneda, teléfono, código postal)
- [ ] `co` — Colombia (NIT, CC, moneda, teléfono, código postal)
- [ ] `pe` — Perú (RUC, DNI, moneda, teléfono, código postal)
- [ ] `detect()` — Auto-detección
- [ ] Otro: <!-- especifica -->

## Reproducción

```ts
// Código que reproduce el bug
import { br } from '@commenteme/palta'

br.cpf.format('...')  // resultado actual
// resultado esperado: '...'
```

## Comportamiento actual

<!-- Qué devuelve hoy -->

## Comportamiento esperado

<!-- Qué debería devolver -->

## Versión

- `@commenteme/palta`: <!-- ej: 1.0.5 -->
- Node.js: <!-- ej: 20.x -->
- Entorno: <!-- Node / Browser / Edge -->
