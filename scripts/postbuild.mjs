#!/usr/bin/env node
/**
 * Runs after `vite build`. Two jobs, both needed because content here is
 * admin-managed and this deploys to static Apache hosting with no edge
 * functions:
 *
 * 1. sitemap.xml — every published entry, regenerated on each build.
 * 2. Per-entry prerendered index.html — a clone of the SPA shell with a
 *    real <title>, meta description, canonical link, OG/Twitter tags, and
 *    JSON-LD baked into the raw HTML. WhatsApp/Facebook/Google's crawlers
 *    don't execute JavaScript, so tags injected at runtime (the Head
 *    component) are invisible to them — this is what actually closes that
 *    gap. Real visitors get the exact same shell; React mounts into
 *    #root and takes over normally.
 *
 * KNOWN GAP (documented, not silently ignored): this runs at build time.
 * A newly published entry has no prerendered page — and no sitemap entry
 * — until the next deploy. There's no edge function here to close that
 * gap live (see docs/09-POLISH-LAUNCH.md report for why, and the
 * recommended fix). Until then: publish, then rebuild+redeploy soon after
 * for anything you expect to be shared right away.
 */
import { createClient } from '@supabase/supabase-js'
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const DIST = path.join(ROOT, 'dist')
const SITE_URL = 'https://conectalapa.com.br'

try {
  process.loadEnvFile?.(path.join(ROOT, '.env'))
} catch {
  // .env file is optional; on hosting platforms like Hostinger env vars are injected directly into process.env
}

const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('[postbuild] Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY — skipping sitemap and prerender.')
  process.exit(0)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

const DOMAINS = [
  { table: 'businesses', path: 'empresas', kind: 'business' },
  { table: 'events', path: 'eventos', kind: 'event' },
  { table: 'packages', path: 'pacotes', kind: 'package' },
  { table: 'lodging', path: 'hospedagem', kind: 'lodging' },
  { table: 'dining', path: 'gastronomia', kind: 'dining' },
]

const STATIC_PATHS = [
  { path: '/', changefreq: 'daily', priority: '1.0' },
  { path: '/empresas', changefreq: 'daily', priority: '0.8' },
  { path: '/eventos', changefreq: 'daily', priority: '0.8' },
  { path: '/pacotes', changefreq: 'daily', priority: '0.8' },
  { path: '/hospedagem', changefreq: 'daily', priority: '0.8' },
  { path: '/gastronomia', changefreq: 'daily', priority: '0.8' },
  { path: '/busca', changefreq: 'monthly', priority: '0.3' },
  { path: '/solicitar', changefreq: 'monthly', priority: '0.5' },
  { path: '/sobre', changefreq: 'monthly', priority: '0.3' },
]

async function fetchDomainRows(domain) {
  const { data, error } = await supabase
    .from(domain.table)
    .select('*, category:categories(name)')
    .eq('status', 'published')
  if (error) {
    console.error(`[postbuild] Failed to fetch ${domain.table}:`, error.message)
    return []
  }
  return data || []
}

function escapeXml(value) {
  return String(value).replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c]))
}

function buildSitemap(entries) {
  const urls = [
    ...STATIC_PATHS.map((s) => ({ loc: SITE_URL + s.path, changefreq: s.changefreq, priority: s.priority })),
    ...entries.map((e) => ({ loc: `${SITE_URL}${e.routePath}`, lastmod: e.updated_at?.slice(0, 10), changefreq: 'weekly', priority: '0.6' })),
  ]

  const body = urls
    .map(
      (u) => `  <url>
    <loc>${escapeXml(u.loc)}</loc>
${u.lastmod ? `    <lastmod>${u.lastmod}</lastmod>\n` : ''}    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`
}

function escapeHtml(value) {
  return String(value).replace(/[<>&"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c]))
}

const ADDRESS_DEFAULTS = { addressLocality: 'Bom Jesus da Lapa', addressRegion: 'BA', addressCountry: 'BR' }

function buildJsonLd(entry) {
  const url = `${SITE_URL}${entry.routePath}`

  if (entry.kind === 'business' || entry.kind === 'lodging' || entry.kind === 'dining') {
    const type = entry.kind === 'dining' ? 'Restaurant' : entry.kind === 'lodging' ? 'LodgingBusiness' : 'LocalBusiness'
    const json = {
      '@context': 'https://schema.org',
      '@type': type,
      name: entry.name,
      url,
      description: entry.description || undefined,
      image: entry.logo_url || entry.image_url || undefined,
      telephone: entry.whatsapp || undefined,
      address: entry.address ? { '@type': 'PostalAddress', streetAddress: entry.address, ...ADDRESS_DEFAULTS } : undefined,
      priceRange: entry.price_range || undefined,
    }
    return json
  }

  if (entry.kind === 'event') {
    const json = {
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: entry.name,
      url,
      description: entry.description || undefined,
      image: entry.promotional_image_url || undefined,
      startDate: entry.start_datetime,
      endDate: entry.end_datetime || undefined,
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      eventStatus: 'https://schema.org/EventScheduled',
      location: {
        '@type': 'Place',
        name: entry.venue_name || 'Bom Jesus da Lapa',
        address: entry.address ? { '@type': 'PostalAddress', streetAddress: entry.address, ...ADDRESS_DEFAULTS } : ADDRESS_DEFAULTS,
      },
      offers:
        entry.ticket_price != null
          ? {
              '@type': 'Offer',
              price: entry.ticket_price,
              priceCurrency: 'BRL',
              availability: 'https://schema.org/InStock',
              url,
            }
          : undefined,
    }
    return json
  }

  if (entry.kind === 'package') {
    return {
      '@context': 'https://schema.org',
      '@type': 'TouristTrip',
      name: `Pacote para ${entry.destination}`,
      url,
      description: entry.information || undefined,
      image: entry.image_url || undefined,
      offers:
        entry.price != null
          ? { '@type': 'Offer', price: entry.price, priceCurrency: 'BRL', url }
          : undefined,
    }
  }

  return null
}

function stripUndefined(obj) {
  return JSON.parse(JSON.stringify(obj))
}

function renderPage(shellHtml, entry) {
  const title = entry.metaTitle
  const description = (entry.description || entry.information || `${entry.metaTitle} — ConectaLapa`).slice(0, 160)
  const url = `${SITE_URL}${entry.routePath}`
  const image = entry.logo_url || entry.image_url || entry.promotional_image_url || null
  const jsonLd = buildJsonLd(entry)

  const headExtra = `
    <title>${escapeHtml(title)} — ConectaLapa</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <link rel="canonical" href="${url}" />
    <meta property="og:title" content="${escapeHtml(title)} — ConectaLapa" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:type" content="${entry.kind === 'event' ? 'article' : 'website'}" />
    ${image ? `<meta property="og:image" content="${escapeHtml(image)}" />` : ''}
    <meta name="twitter:card" content="${image ? 'summary_large_image' : 'summary'}" />
    <meta name="twitter:title" content="${escapeHtml(title)} — ConectaLapa" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    ${image ? `<meta name="twitter:image" content="${escapeHtml(image)}" />` : ''}
    ${jsonLd ? `<script type="application/ld+json">${JSON.stringify(stripUndefined(jsonLd))}</script>` : ''}
  `

  // The shell's own <title>/<meta name="description"> are replaced, not
  // duplicated — crawlers should see exactly one of each.
  return shellHtml
    .replace(/<title>.*?<\/title>/s, '')
    .replace(/<meta name="description"[^>]*>/s, '')
    .replace('</head>', `${headExtra}\n  </head>`)
}

async function main() {
  const shellPath = path.join(DIST, 'index.html')
  if (!existsSync(shellPath)) {
    console.error('[postbuild] dist/index.html not found — run `vite build` first.')
    process.exit(1)
  }
  const shellHtml = readFileSync(shellPath, 'utf-8')

  const entries = []
  for (const domain of DOMAINS) {
    const rows = await fetchDomainRows(domain)
    for (const row of rows) {
      const name = row.name || row.destination
      entries.push({
        ...row,
        kind: domain.kind,
        routePath: `/${domain.path}/${row.slug}`,
        metaTitle: domain.kind === 'package' ? `Pacote para ${row.destination}` : name,
      })
    }
  }

  // 1. Sitemap
  writeFileSync(path.join(DIST, 'sitemap.xml'), buildSitemap(entries))
  console.log(`[postbuild] sitemap.xml — ${entries.length + STATIC_PATHS.length} URLs`)

  // 2. Per-entry prerendered pages
  let written = 0
  for (const entry of entries) {
    const outDir = path.join(DIST, entry.routePath.replace(/^\//, ''))
    mkdirSync(outDir, { recursive: true })
    writeFileSync(path.join(outDir, 'index.html'), renderPage(shellHtml, entry))
    written++
  }
  console.log(`[postbuild] prerendered ${written} entry pages with meta tags + JSON-LD`)
}

main().catch((err) => {
  console.error('[postbuild] failed:', err)
  process.exit(1)
})
