// Prepara un proyecto de Supabase NUEVO (el del centro) con este CRM: lo enlaza, aplica las migraciones
// y explica lo que queda por hacer en los paneles de Supabase y Vercel.
// Uso: `npm run setup` (pregunta la referencia del proyecto) o `npm run setup -- --project-ref abcd1234`.
// No carga datos de prueba (supabase/seed.sql es solo para el entorno local) ni toca supabase/config.toml del remoto.
import { spawnSync } from 'node:child_process'
import { createInterface } from 'node:readline/promises'

const run = (cmd, args = []) => spawnSync(cmd, args, { stdio: 'inherit', shell: true })
const paso = (t) => console.log(`\n\x1b[36m▶ ${t}\x1b[0m`)
const fallo = (t) => { console.error(`\n\x1b[31m✖ ${t}\x1b[0m`); process.exit(1) }

if (Number(process.versions.node.split('.')[0]) < 20) fallo(`Hace falta Node 20 o superior (tienes ${process.versions.node}).`)

// Referencia del proyecto: --project-ref xxx, o se pregunta
let ref = process.argv.includes('--project-ref') ? process.argv[process.argv.indexOf('--project-ref') + 1] : ''
if (!ref) {
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  console.log('Crea antes un proyecto vacío en https://supabase.com/dashboard (guarda la contraseña de la base de datos).')
  console.log('La referencia es el texto de la URL del panel: supabase.com/dashboard/project/<referencia>')
  ref = (await rl.question('Referencia del proyecto de Supabase: ')).trim()
  rl.close()
}
if (!/^[a-z0-9]{15,25}$/.test(ref)) fallo('La referencia no parece válida (son unas 20 letras y números, en minúsculas).')

paso('Iniciando sesión en Supabase (se abre el navegador; si ya la tienes iniciada, no hace nada)')
if (!process.env.SUPABASE_ACCESS_TOKEN && run('npx', ['supabase', 'projects', 'list']).status !== 0) {
  if (run('npx', ['supabase', 'login']).status !== 0) fallo('No se ha podido iniciar sesión en Supabase.')
}

paso(`Enlazando con el proyecto ${ref} (pide la contraseña de la base de datos)`)
if (run('npx', ['supabase', 'link', '--project-ref', ref]).status !== 0) fallo('supabase link ha fallado.')

paso('Aplicando las migraciones (crea las tablas, políticas y funciones)')
if (run('npx', ['supabase', 'db', 'push']).status !== 0) fallo('supabase db push ha fallado.')

console.log(`
\x1b[32m✔ Base de datos lista.\x1b[0m Quedan estos pasos en los paneles (no se pueden hacer desde aquí):

  1. Supabase → Authentication → Hooks → «Before User Created»: actívalo con la función Postgres
     public.hook_antes_de_crear_usuario (bloquea correos desechables).
  2. Supabase → Authentication → Sign In / Providers → Email: deja «Confirm email» activado, longitud
     mínima 8 y «letters and digits».
  3. Supabase → Authentication → SMTP: configura un SMTP propio (el de Supabase solo envía unos pocos correos por hora).
  4. Vercel: importa el repositorio y pon estas variables de entorno:
       VITE_SUPABASE_URL=https://${ref}.supabase.co
       VITE_SUPABASE_ANON_KEY=<Project Settings → API → anon/publishable key>
       SUPABASE_URL=https://${ref}.supabase.co
       SUPABASE_SERVICE_ROLE_KEY=<Project Settings → API → service_role (SECRETA)>
       GMAIL_USER y GMAIL_APP_PASSWORD (solo si usas el correo; ver server/README.md)
  5. Supabase → Authentication → URL Configuration: pon la URL de Vercel como «Site URL» y en «Redirect URLs».
  6. Abre la web y regístrate el primero: serás admin. Configura el centro en la pestaña Ajustes.
`)
