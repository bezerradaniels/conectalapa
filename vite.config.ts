import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    modulePreload: {
      // Vite's default modulePreload injects <link rel="modulepreload">
      // into index.html for every chunk transitively reachable from the
      // entry — including chunks that are only ever reached through a
      // route-level React.lazy() dynamic import. That defeats the point
      // of lazy-loading: vendor-forms (react-hook-form + zod, ~37KB gzip,
      // used only by admin/submit forms) was still being eagerly fetched
      // on the home page's very first request. Trim the root HTML's
      // preload list to what main.tsx's own eager chain actually needs;
      // each lazily-loaded route chunk still gets its own genuine
      // dependencies preloaded at the moment it's actually requested.
      resolveDependencies: (_filename, deps, { hostType }) => {
        if (hostType !== 'html') return deps
        return deps.filter((dep) => !dep.includes('vendor-forms') && !dep.includes('vendor-date'))
      },
    },
    rollupOptions: {
      output: {
        // Rollup's automatic chunking is a heuristic that can shift with
        // unrelated code changes — it once silently merged zod into the
        // main entry chunk (+80KB on every route, including the home
        // page, which never imports it) after an edit elsewhere removed
        // one incidental import edge. Pinning the heavy, route-specific
        // vendor libraries to named chunks makes that split deterministic:
        // these are only fetched by routes (admin/submit forms) that
        // actually import from them.
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (id.includes('zod') || id.includes('@hookform') || id.includes('react-hook-form')) return 'vendor-forms'
          if (id.includes('@supabase')) return 'vendor-supabase'
          if (id.includes('date-fns')) return 'vendor-date'
          return undefined
        },
      },
    },
  },
})
