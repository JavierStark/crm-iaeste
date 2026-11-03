# Actualizar tu CRM con las novedades del template

Tu copia es independiente: no se actualiza sola. Cuando el template publique una versión nueva (ver [`CHANGELOG.md`](CHANGELOG.md) y las *Releases* de GitHub), tráela así. Tus datos y tu configuración viven en tu Supabase, así que no se tocan.

```bash
# Una sola vez: apunta a este repositorio como "upstream"
git remote add upstream https://github.com/<propietario>/<repo-template>.git

# Cada vez que quieras actualizar
git fetch upstream
git merge upstream/main          # si tocaste código, aquí puede haber conflictos que resolver
npm install
npx supabase db push             # aplica las migraciones nuevas a tu Supabase
git push                         # Vercel vuelve a desplegar solo
```

- Si el `CHANGELOG` dice que hay **migraciones nuevas**, el paso `db push` es obligatorio: sin él la web nueva puede esperar tablas o funciones que aún no existen.
- Si solo usas Ajustes y no has editado ficheros del código, el `merge` no tiene conflictos.
- Antes de actualizar en producción puedes probarlo en local: `npm run db:reset && npm run db:test` (ver el README).

## Para quien mantiene el template

- **Nunca edites una migración ya publicada** (`supabase/migrations/*`): los centros que la aplicaron no la volverán a ejecutar. Añade una migración nueva con `npm run db:new-migration nombre`.
- Cada versión nueva: apunta los cambios en `CHANGELOG.md` (indicando las migraciones nuevas) y crea una *Release* de GitHub con una etiqueta `vX.Y.Z`.
- No subas datos reales al repo (nombres, correos, puntos). Las importaciones se aplican a mano con el CLI de Supabase.
