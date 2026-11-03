# CRM de empresas multicentro

Aplicación web para gestionar el contacto con empresas de un comité: quién habla con quién, en qué punto está cada conversación, cuándo toca el siguiente seguimiento, plantillas de correo compartidas y, si se quiere, una puntuación de campaña con clasificación del equipo.

Es un **template**: pulsa **Use this template** en GitHub para tener tu propia copia y despliégala con tu propio Vercel y tu propio Supabase (ver [«Montar el CRM para un centro nuevo»](#montar-el-crm-para-un-centro-nuevo)). Los datos de cada centro quedan en su Supabase; no hay ningún servidor compartido. **Todo lo que cambia de un centro a otro se configura desde el propio CRM** (pestaña **Ajustes**, solo admins), sin tocar código:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FTU-USUARIO%2FTU-REPO&env=VITE_SUPABASE_URL,VITE_SUPABASE_ANON_KEY,SUPABASE_URL,SUPABASE_SERVICE_ROLE_KEY,GMAIL_USER,GMAIL_APP_PASSWORD&envDescription=Claves%20de%20tu%20proyecto%20de%20Supabase%20y%20del%20Gmail%20compartido&envLink=https%3A%2F%2Fgithub.com%2FTU-USUARIO%2FTU-REPO%23desplegar-desde-cero-supabase--vercel)

> Sustituye `TU-USUARIO/TU-REPO` del botón por la URL de tu repositorio. Crea antes el Supabase (`npm run setup`): el botón te pedirá sus claves.

| En Ajustes | Qué se cambia |
|---|---|
| **Nombre y aspecto** | Nombre del centro, título, ciudad, textos de la pantalla de entrada, logo (se sube una imagen) y color de marca (con vista previa en vivo) |
| **Funciones** | Encender o apagar: correo, plantillas, puntuación, registro de llamadas, empresas prioritarias, lista negra, reclamar empresas, pestaña Seguimiento, gráfica, exportar y guía. Apagar solo oculta: los datos se conservan |
| **Empresas y equipo** | Tamaño de los lotes, aviso de «te quedan pocas», subcentros (escuelas/facultades) y cómo se llaman, y nombres de los estados |
| **Correo** | Nombre del remitente y asunto del primer correo |
| **Puntuación** | Puntos automáticos por empresa y por llamada, categoría que los recibe, mínimo para el nivel «Mínimo», primera campaña y la **rúbrica completa**: categorías y conceptos (puntos, rangos, unidad, notas y cuáles cuentan como práctica) |
| **Copia de seguridad** | Descargar la configuración en un archivo o cargar la de otro centro como punto de partida |

Al pulsar **Guardar cambios** se aplica a todo el equipo (la página se recarga).

**Stack:** React 18 + Vite + Tailwind CSS v4 + Supabase (Auth + Postgres con Row Level Security). Despliegue íntegro en Vercel (web + API de correo) y Supabase.

## Roles

| Rol | Qué puede hacer |
|---|---|
| **Admin** | Ver y editar todo, crear/borrar empresas, asignarlas, registrar prácticas (empresas prioritarias), cambiar roles y centros, poner contraseñas temporales, dar, editar y penalizar puntos de la rúbrica, ajustar los automáticos y resolver solicitudes de puntos |
| **Miembro** | Ver todas las empresas (las ajenas en solo lectura). Crear empresas (quedan asignadas a él) y, en las suyas, editar contacto, CIF, estado, notas y próximo contacto. Registrar llamadas, ver su desglose de puntos y el total de los demás, y solicitar puntos |

Las reglas están impuestas en la base de datos (políticas RLS y triggers), no solo en la interfaz. El primer usuario que se registra en una base vacía es admin. Siempre tiene que quedar al menos un admin.

---

## Entorno local (con base de datos propia)

Todo corre en tu máquina con el CLI de Supabase sobre Docker: Postgres, Auth, API y un buzón de correo falso. No toca ningún proyecto real. Usa puertos propios (app 5174, Supabase 553xx, correo 8788) para no chocar con otros proyectos.

Los datos de prueba ponen un «Centro Demo» (con puntuación y cinco subcentros de ejemplo); cámbialo en Ajustes para probar otro centro y `npm run db:reset` lo devuelve al de demostración.

**Requisitos:** Node 20+ y Docker Desktop abierto. La primera vez se descargan unas imágenes (unos minutos).

```bash
npm install
npm run local:setup     # arranca Supabase, aplica migraciones + datos de prueba y crea .env.development.local
npm run dev             # http://localhost:5174
```

**Todo de una vez:** `npm run local` instala lo que falte, arranca Supabase, genera los `.env`, y lanza el servicio de correo y la app. `Ctrl+C` lo apaga todo (con `--keep-db` deja Supabase encendido; `npm run local:stop` lo apaga a mano).

| Servicio | URL |
|---|---|
| App | http://localhost:5174 |
| Supabase Studio (ver/editar tablas) | http://127.0.0.1:55323 |
| Mailpit (correos de confirmación y recuperación) | http://127.0.0.1:55324 |

**Usuarios de prueba** (definidos en `supabase/seed.sql`):

| Email | Contraseña | Rol |
|---|---|---|
| ana@demo.test | Admin1234 | admin |
| luis@demo.test | Admin1234 | admin |
| marta@demo.test | Miembro1234 | miembro |
| pablo@demo.test | Miembro1234 | miembro |
| irene@demo.test | Miembro1234 | miembro |

Los datos de prueba (38 empresas ficticias con historial, prioritarias y bote común sin asignar) se generan con fechas relativas a hoy, así que la agenda, los avisos de seguimiento siempre tienen algo que mostrar.

Si te registras con un email nuevo, el correo de confirmación llega a **Mailpit**, no a una bandeja real.

### Comandos útiles

| Comando | Qué hace |
|---|---|
| `npm run db:reset` | Borra la base local y la recrea desde las migraciones + seed |
| `npm run db:test` | Prueba de humo de permisos, triggers y RPCs contra la base local (modifica datos: haz `db:reset` después) |
| `npm run db:stop` / `db:start` | Apaga / enciende los contenedores (los datos se conservan) |
| `npm run db:status` | URLs y claves locales |
| `npm run db:new-migration nombre` | Crea una migración nueva en `supabase/migrations/` |
| `npm run build` | Build de producción en `dist/` |

---

## Puntuaciones y subcentros

Cada persona elige su **subcentro** (por ejemplo, escuelas o facultades) al registrarse si el centro tiene alguno; un admin puede cambiarlo en Equipo, y la lista se edita en Ajustes (tabla `subcentros`). La pestaña **Puntos** suma, por campaña (año natural, de enero a diciembre), los puntos automáticos por empresas del CRM (cuentan en la categoría elegida en Ajustes, en la rúbrica de ejemplo «H. Empresas») y los apuntes que dan los admins según la rúbrica. La rúbrica se edita en **Ajustes → Puntuación** y se guarda en la tabla `configuracion`; mientras no se guarde una propia se usa la de ejemplo (`src/rubricaEjemplo.js`, genérica y pequeña; en `examples/rubrica-iaeste-malaga.json` hay una completa para cargarla desde Ajustes). Los apuntes guardan copia del texto del concepto, así que cambiar la rúbrica no altera lo ya anotado.

- Cada persona ve su desglose con motivos; de los demás, solo el total (RLS en la tabla `puntos` y RPC `puntuacion_resumen`).
- Clasificación: nivel (Práctica > Mínimo de la categoría de empresas, 30 por defecto > Pendiente), total y puntos de esa categoría. «Práctica» = algún apunte de un concepto marcado como práctica en la rúbrica (lo calcula `puntuacion_resumen` leyendo la configuración).
- Puntos automáticos (valores en Ajustes → Puntuación): por empresa (por defecto 1 si dicen que no sin haber enviado el correo, 2 si se ha enviado el correo aunque luego digan que no) y por cada llamada, también para el responsable de la empresa (no lo cogen 0,5, seguimiento 3), registradas desde la ficha con la RPC `registrar_llamada`. Un admin puede cambiar o quitar los de una fila concreta (tabla `puntos_auto_ajustes`).
- Penalizaciones: concepto «Penalización» de cualquier categoría; se guardan como apuntes con puntos negativos.
- Solicitudes: cualquiera pide puntos (tabla `solicitudes_puntos`) y un admin la ajusta y acepta o la rechaza (RPC `resolver_solicitud`).
- Al empezar campaña, el admin anota con **Dar puntos** la antigüedad (5 por campaña) y el arrastre (la mitad de los puntos, nada si eran menos de 10 o hubo práctica), categoría «Inicio de campaña».
- Los apuntes pueden importarse sin cuenta (`usuario_id` nulo, con `socio_nombre`): se vinculan solos cuando alguien se registra con el mismo nombre. Importar datos reales (nombres) **no se hace desde el repo**, que es público: se aplica el SQL a mano con el CLI de Supabase.

## Correo (enviar y recibir desde la ficha de cada empresa)

Cada empresa tiene un hilo de correos y una caja para responder, usando un buzón compartido de Gmail por SMTP/IMAP (el equipo no necesita acceso a la cuenta de Google). Lo hace un pequeño servicio Node en `server/`: guía completa, variables y cómo crear la contraseña de aplicación en [`server/README.md`](server/README.md).

```bash
npm run server:install   # una vez
npm run correo           # http://localhost:8788 — en local envía a Mailpit
```

## Montar el CRM para un centro nuevo

Unos 20 minutos. Cada centro tiene su propio Supabase (sus datos) y su propio proyecto de Vercel (su web), cada uno desde su copia del template.

0. **Tu copia**: en GitHub, **Use this template → Create a new repository** (puede ser privado). Clónala y ejecuta `npm install`.
1. **Supabase y Vercel**: sigue «Desplegar desde cero» (abajo) con un proyecto nuevo de cada; `npm run setup` hace la parte de la base de datos.
2. **Primer admin**: regístrate tú primero en la web nueva; el primer usuario de una base vacía es admin.
3. **Ajustes**: entra en la pestaña **Ajustes** y rellena nombre, logo y color; apaga lo que el centro no quiera (por defecto la **puntuación está apagada**); añade sus subcentros si los tiene.
   - Si el centro quiere puntuación, enciéndela en Funciones y edita la rúbrica en Ajustes → Puntuación: parte de la de ejemplo, **Empezar de cero**, o **Copia de seguridad → Cargar desde archivo** con la de otro centro.
4. **Plantillas**: la base trae una plantilla de primer contacto genérica con `{{empresa}}`, `{{contacto}}` y `{{yo}}`; edítala o bórrala en la pestaña Plantillas.
5. **Buzón**: si usan correo, crea su Gmail compartido y pon `GMAIL_USER` / `GMAIL_APP_PASSWORD` en Vercel (ver [`server/README.md`](server/README.md)). Si no, apaga «Correo con las empresas» en Ajustes.
6. Pásales el enlace de registro (`https://<su-web>/?registro`) y reparte empresas desde Equipo.

Ningún paso requiere tocar código. Lo único que sigue en código son los **estados** del pipeline (sus ids están en la base de datos; los nombres sí se cambian en Ajustes).

## Desplegar desde cero (Supabase + Vercel)

1. **Supabase:** crea un proyecto vacío en [supabase.com](https://supabase.com). En una terminal del repo ejecuta `npm run setup` (pide la referencia del proyecto, inicia sesión, enlaza y aplica las migraciones; **no** carga el seed). A mano sería `npx supabase login`, `npx supabase link --project-ref <ref>` y `npx supabase db push`.
2. **Authentication → Hooks → Before User Created:** actívalo con la función Postgres `public.hook_antes_de_crear_usuario` (bloquea correos desechables).
3. **Authentication → Sign In / Providers → Email:** deja **Confirm email** activado, longitud mínima 8 y "letters and digits". **URL Configuration:** pon la URL de Vercel como *Site URL* y en *Redirect URLs* (necesario para recuperación de contraseña y confirmación).
4. **Authentication → SMTP:** el correo por defecto de Supabase está muy limitado (pocos mensajes por hora); configura un SMTP propio para que el equipo pueda registrarse y recuperar contraseñas.
5. **Vercel:** importa el repo (detecta Vite). La API de correo corre en el mismo proyecto como función serverless (`api/index.js`), así que no hace falta ningún otro hosting. Variables de entorno:
   - `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` (Project Settings → API → *anon/publishable key*).
   - `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` (**secreta**, sin prefijo `VITE_`).
   - `GMAIL_USER`, `GMAIL_APP_PASSWORD` y, opcional, `MAIL_FROM_NAME` (ver [`server/README.md`](server/README.md) para crear la contraseña de aplicación).
   No definas `VITE_EMAIL_API_URL`: sin ella el navegador usa `/api/...` del mismo dominio.
   Los correos entrantes **no se leen en segundo plano**: se buscan en Gmail cuando alguien abre los correos de una empresa o pulsa el botón de actualizar.
6. Regístrate tú primero: serás admin. Configura el centro en **Ajustes** y después los demás se registran; desde la pestaña **Equipo** les asignas empresas o los haces admin.

Para traer las novedades del template a tu copia, mira [`UPDATING.md`](UPDATING.md).

La anon key es pública por diseño; la seguridad la imponen las políticas RLS. Nunca pongas la `service_role`/secret key en el frontend ni en el repo.

## Estructura

```
src/App.jsx                  toda la aplicación (un solo fichero a propósito)
src/centro.js                configuración del centro: valores por defecto y carga desde la tabla `configuracion`
src/Configuracion.jsx        pestaña Ajustes (editor de la configuración)
src/puntuaciones.js          interpreta la rúbrica y calcula la clasificación
src/rubricaEjemplo.js        rúbrica de ejemplo genérica
src/estados.js               estados del pipeline (ids fijos; los nombres se cambian en Ajustes)
src/ui.jsx                   componentes básicos compartidos
src/supabase.js              cliente de Supabase
public/                      archivos estáticos (el logo se sube desde Ajustes)
examples/                    configuraciones de ejemplo para «Cargar desde archivo»
supabase/migrations/         esquema de la base de datos (fuente de verdad)
server/                      servicio de correo SMTP/IMAP (Node)
supabase/seed.sql            datos de prueba SOLO para local
supabase/config.toml         configuración del Supabase local
scripts/setup.mjs            prepara el Supabase de un centro nuevo (`npm run setup`)
scripts/env-local.mjs        genera .env.development.local
scripts/smoke-test.mjs       prueba de humo de la base de datos
```

### Cambiar la base de datos

Siempre con una **migración nueva** (`npm run db:new-migration nombre`), nunca editando una ya publicada (los centros que la aplicaron no la repiten) ni desde el SQL Editor sin dejar rastro. Pruébala con `npm run db:reset` y `npm run db:test`. Los estados del pipeline viven en dos sitios que deben coincidir: `ESTADOS_TODOS` en `src/estados.js` y el `check` de `empresas.estado` en la migración.

**Nueva opción de configuración:** añádela con su valor por defecto en `DEFECTO` (`src/centro.js`), léela con `CENTRO.<opción>` (o `F.<función>` si es un interruptor, añadiéndola también a `FUNCIONES`) y ponle su campo en `src/Configuracion.jsx`. No hace falta migración: se guarda dentro del JSON de `configuracion`.

## Problemas frecuentes

| Síntoma | Causa | Solución |
|---|---|---|
| Página en blanco con error de variables | Falta `.env.development.local` | `npm run db:env` (con Supabase arrancado) |
| `local:setup` falla al conectar con Docker | Docker Desktop apagado | Ábrelo y espera a que diga *Engine running* |
| "No se han podido cargar los datos" | Supabase local parado o proyecto remoto pausado | `npm run db:start`, o *Restore project* en Supabase |
| Registro: "demasiados intentos" | Límite de correos de Supabase | Configura SMTP propio (ver arriba) |
| Un miembro no puede cambiar nombre/sector/responsable | Es la protección funcionando | Lo hace un admin |
