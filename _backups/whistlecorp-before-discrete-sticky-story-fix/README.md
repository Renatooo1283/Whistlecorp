# WhistleCorp — Sitio web

Sitio multipágina construido con **Next.js 16 (App Router) + TypeScript + Tailwind v4**.

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS v4 (tokens en `app/globals.css` via `@theme`)
- react-hook-form + zod (formulario inteligente)
- lucide-react (iconos)
- framer-motion, clsx, tailwind-merge

## Cómo ejecutar

```powershell
npm install        # solo la primera vez
npm run dev        # http://localhost:3000
npm run build      # build de producción
npm start          # servir el build
npm run lint       # ESLint
```

## Rutas

| Ruta | Descripción |
|---|---|
| `/` | Home con resumen comercial |
| `/servicios` | Índice de las 4 líneas de servicio |
| `/servicios/desarrollo-software` | Desarrollo a medida |
| `/servicios/automatizacion` | Automatización de procesos |
| `/servicios/infraestructura-cloud` | Infraestructura y nube |
| `/servicios/consultoria` | Consultoría tecnológica |
| `/casos-de-uso` | Ejemplos tipo de soluciones |
| `/nosotros` | Sobre WhistleCorp |
| `/contacto` | Formulario inteligente + datos |
| `/gracias` | Confirmación post-envío con WhatsApp prellenado |

## Estructura

```
app/                  Rutas (App Router)
components/
  ui/                 Primitivos (Button, Card, Section, etc.)
  layout/             Navbar, Footer, WhatsAppFloat
  blocks/             Bloques de contenido reutilizables
  form/               Formulario inteligente multi-step
lib/
  content/            Copy centralizado por página
  forms/              schema (zod), submit, WhatsApp, labels
  seo.ts              Helper de metadata
  utils.ts            cn() para clases
public/imagenes/      Imágenes del sitio
```

## Cómo editar textos

Toda la copia vive en `lib/content/`:

- `home.ts` — hero, problemas, soluciones, automatizaciones, workflow, CTA.
- `services.ts` — índice y las 4 subpáginas de servicios.
- `use-cases.ts` — los 7 casos tipo.
- `about.ts` — página Nosotros.
- `contact.ts` — página Contacto y página Gracias.
- `navigation.ts` — menú principal, footer y datos de contacto.

Edita el string, guarda, y verás el cambio en `npm run dev`.

## Cómo cambiar imágenes

1. Coloca el archivo en `public/imagenes/`.
2. Actualiza la ruta `src` en el archivo de contenido correspondiente:
   - Home → `app/page.tsx` (hero).
   - Subpáginas de servicio → `lib/content/services.ts` (campo `image`).
   - Nosotros → `lib/content/about.ts` (campo `image`).

> Las imágenes originales están duplicadas en `imagenes/` (referencia) y `public/imagenes/` (usadas por el sitio). Solo las de `public/` se sirven.

## Cómo probar el formulario

1. Ve a `/contacto`.
2. Completa los 3 pasos. La validación bloquea avanzar si hay errores.
3. Al enviar:
   - El payload queda persistido en `sessionStorage` bajo la clave `diagnostic.lastSubmission`.
   - En desarrollo se imprime en consola del navegador.
   - Te redirige a `/gracias`.
4. En `/gracias`, el botón **Escribir por WhatsApp** abre `wa.me` con el resumen del caso prellenado.

## Cómo conectar el backend del formulario

El **único punto de integración** es `lib/forms/submit.ts` → `submitDiagnostic(data)`. La UI no necesita ningún cambio.

Variables disponibles en `.env.example` (copiar a `.env.local`):

```
NEXT_PUBLIC_DIAGNOSTIC_WEBHOOK_URL=
NEXT_PUBLIC_WHATSAPP_NUMBER=593999420013
```

Las tres opciones dejadas listas en comentarios dentro de `submit.ts`:

### A. Supabase

```ts
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(URL, KEY);
const { error } = await supabase.from("diagnostics").insert(data);
if (error) return { ok: false, error: error.message };
```

### B. Webhook (Make / n8n / Google Apps Script)

```ts
const res = await fetch(process.env.NEXT_PUBLIC_DIAGNOSTIC_WEBHOOK_URL!, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
});
if (!res.ok) return { ok: false, error: "Error en webhook" };
```

### C. Envío de correo (vía API route)

Crear `app/api/contact/route.ts` con tu proveedor de correo (Resend, SendGrid, Nodemailer, etc.) y dentro de `submit.ts`:

```ts
const res = await fetch("/api/contact", {
  method: "POST",
  body: JSON.stringify(data),
});
if (!res.ok) return { ok: false, error: "Error al enviar" };
```

## Colores y diseño

Tokens en `app/globals.css` (CSS variables con `@theme`):

| Variable | Valor | Uso |
|---|---|---|
| `--color-ink` | `#0B1B2B` | Hero, footer, CTA final |
| `--color-ink-soft` | `#1E3A5F` | Acentos secundarios |
| `--color-accent` | `#16A34A` | CTAs, badges, iconos, hover (uso restringido) |
| `--color-bg` | `#FFFFFF` | Fondo base |
| `--color-bg-alt` | `#F4F6F8` | Secciones alternas |
| `--color-text` | `#475569` | Cuerpo |
| `--color-text-strong` | `#0F172A` | Títulos |

Tipografía: stack **Inter** + system fallback (definido en `app/globals.css`).

## Despliegue

Recomendado: **Vercel** (deploy directo desde Git).

```powershell
npx vercel
```

O cualquier proveedor que soporte Next.js (Netlify, Railway, Render, AWS Amplify, etc.).

## Publicación y SEO inicial

Pasos recomendados luego de publicar el sitio nuevo:

1. **Publicar la web nueva** en Vercel (o el host elegido) apuntando el dominio `www.whistlecorp.com`. Configura `whistlecorp.com` → redirección 301 a `www.whistlecorp.com` (o viceversa) para tener una sola URL canónica.
2. **Verificar que existan estos endpoints** una vez publicado:
   - https://www.whistlecorp.com/sitemap.xml
   - https://www.whistlecorp.com/robots.txt
3. **Conectar el dominio en Google Search Console** (https://search.google.com/search-console). Verifica la propiedad por registro DNS o por etiqueta `<meta>` (Search Console te indica el método). Usa la propiedad "Dominio" si tienes acceso al DNS.
4. **Enviar el sitemap** desde Search Console → *Sitemaps* → pegar `https://www.whistlecorp.com/sitemap.xml`. Esto acelera el descubrimiento de las páginas.
5. **Crear o actualizar Google Business Profile** (https://www.google.com/business/) con la ubicación física, horario, teléfono, sitio web, descripción y al menos 4–6 fotos. Esto es clave para SEO local en Milagro / Guayaquil.
6. **Revisar PageSpeed Insights** (https://pagespeed.web.dev/) para Home y al menos una subpágina de servicio. Mira Core Web Vitals (LCP, CLS, INP) y optimiza imágenes/JS si el score lo pide.
7. **Crear contenido mensual útil** orientado a las búsquedas reales del público objetivo: automatización de procesos, software a medida, dashboards empresariales, formularios inteligentes, soporte tecnológico. Cada artículo debería resolver una pregunta concreta (no copy comercial).

> Aparecer primero en Google **no es inmediato ni garantizado**. Estos pasos construyen la base técnica y de presencia para que el contenido y los enlaces que generes con el tiempo vayan ganando posiciones. Espera resultados orgánicos visibles en 3 a 6 meses si publicas contenido y consigues enlaces de calidad.

### Estado actual del SEO técnico

- `metadataBase` = `https://www.whistlecorp.com` (`app/layout.tsx`).
- `title` y `description` únicos por página (ver `app/**/page.tsx` y `app/gracias/layout.tsx`).
- `canonical` y Open Graph generados por `lib/seo.ts` → `buildMetadata()`.
- `app/sitemap.ts` lista las 9 rutas principales (no incluye `/gracias`).
- `app/robots.ts` permite todo excepto `/gracias` y declara el sitemap.
- `/gracias` con `robots: noindex` (es una página post-conversión, no aporta SEO y duplicaría señales débiles si fuese indexada).
- Headers de seguridad en `next.config.ts` (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `poweredByHeader: false`).

## Propuesta de páginas SEO futuras (no implementadas todavía)

Páginas adicionales para captar tráfico orgánico de búsquedas comerciales específicas. **No están programadas**; usa esto como guion editorial cuando decidamos implementarlas.

### `/soluciones/formularios-inteligentes`

- **Objetivo:** captar búsquedas de empresas que quieren reemplazar formularios de Google/Excel por flujos con validación y ramificación.
- **Keyword principal:** `formularios inteligentes para empresas`
- **Keywords secundarias:** `formularios con validación`, `formularios con flujo`, `formulario web para captar leads`, `formularios para WhatsApp`.
- **Estructura:**
  - H1: Formularios inteligentes para empresas
  - H2: Qué es un formulario inteligente
  - H2: Cuándo conviene usar uno
  - H2: Qué validaciones y flujos podemos construir
  - H2: Integraciones (WhatsApp, Google Sheets, Supabase, correo)
  - H2: Casos de uso reales
- **CTA:** Solicitar diagnóstico.
- **Problema que resuelve:** mensajes perdidos, datos incompletos, leads sin clasificar.
- **Para qué empresas aplica:** PYMES con captación digital (servicios profesionales, salud, educación, retail, agencias).

### `/soluciones/automatizacion-whatsapp`

- **Objetivo:** capturar empresas que reciben muchos mensajes por WhatsApp y necesitan organizarlos.
- **Keyword principal:** `automatización con WhatsApp para empresas`
- **Keywords secundarias:** `WhatsApp Business API`, `bot WhatsApp empresas`, `notificaciones automáticas por WhatsApp`, `respuestas automáticas WhatsApp`.
- **Estructura:**
  - H1: Automatización con WhatsApp para empresas
  - H2: Por qué automatizar WhatsApp
  - H2: Qué se puede automatizar
  - H2: Herramientas (WhatsApp Business API, Make, n8n)
  - H2: Riesgos y buenas prácticas
  - H2: Casos de uso
- **CTA:** Solicitar diagnóstico.
- **Problema que resuelve:** mensajes desordenados, sin trazabilidad, respuestas tardías, leads perdidos.
- **Para qué empresas aplica:** ventas, servicios al cliente, agendamiento, educación, salud.

### `/soluciones/dashboards-empresariales`

- **Objetivo:** captar búsquedas de empresas que quieren visualizar datos operativos en un solo lugar.
- **Keyword principal:** `dashboards empresariales`
- **Keywords secundarias:** `dashboard de ventas`, `dashboard operativo`, `tableros de control para empresas`, `KPIs en tiempo real`.
- **Estructura:**
  - H1: Dashboards empresariales a medida
  - H2: Qué es un dashboard empresarial
  - H2: Tipos de dashboard (ventas, operación, finanzas)
  - H2: Fuentes de datos (Supabase, Google Sheets, ERPs, APIs)
  - H2: Cómo decidimos qué medir
  - H2: Ejemplos
- **CTA:** Solicitar diagnóstico.
- **Problema que resuelve:** reportes manuales, decisiones a ciegas, datos dispersos.
- **Para qué empresas aplica:** empresas con varias áreas o sucursales que necesitan visibilidad operativa.

### `/soluciones/sistemas-web-empresariales`

- **Objetivo:** captar búsquedas de empresas que necesitan un sistema interno o portal.
- **Keyword principal:** `sistemas web empresariales`
- **Keywords secundarias:** `sistema interno para empresa`, `portal de clientes`, `panel administrativo`, `software interno a medida`.
- **Estructura:**
  - H1: Sistemas web empresariales a medida
  - H2: Cuándo un Excel ya no es suficiente
  - H2: Qué construimos (login, roles, paneles, portales)
  - H2: Tecnologías (Next.js, Node, PostgreSQL, Supabase)
  - H2: Cómo trabajamos por fases
  - H2: Ejemplos
- **CTA:** Solicitar diagnóstico.
- **Problema que resuelve:** procesos pegados con Excel/correo, sin trazabilidad ni control de acceso.
- **Para qué empresas aplica:** PYMES con operación interna estructurada (logística, servicios profesionales, distribuidores, manufactura).

> Patrón sugerido para implementar: nueva ruta `app/soluciones/<slug>/page.tsx`, contenido en `lib/content/solutions.ts`, agregar la ruta a `app/sitemap.ts` y a la navegación si corresponde.

