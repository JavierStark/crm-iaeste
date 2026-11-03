# Cambios

Cada versión indica si trae **migraciones nuevas** (hay que ejecutar `npx supabase db push`; ver [`UPDATING.md`](UPDATING.md)).

## 1.0.0

Primera versión del template.

- CRM de empresas multicentro: ficha de empresa con seguimiento, llamadas, notas y estados, reparto de empresas entre el equipo, agenda y avisos de seguimiento.
- Todo lo propio de cada centro se configura desde la pestaña **Ajustes** (nombre, logo, color, funciones, estados, subcentros, correo y puntuación), sin tocar código.
- Correo con las empresas (SMTP/IMAP con un Gmail compartido), plantillas HTML y adjuntos.
- Puntuación opcional: rúbrica editable, clasificación, solicitudes de puntos y puntos automáticos.
- `npm run setup` prepara el Supabase de un centro nuevo; `npm run local` levanta todo en local con datos de prueba.
- Migraciones: `supabase/migrations/20261007000000` a `20261102000000`.
