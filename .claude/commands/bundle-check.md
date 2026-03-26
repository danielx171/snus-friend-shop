# Bundle Size Check

Run a production build and analyze bundle size for performance issues.

## Steps

1. **Run the production build:**
   ```bash
   cd /Users/Daniel/Projects/snus-friend-shop && bun run build
   ```
   Capture the full output — Vite prints chunk sizes at the end.

2. **Parse build output** — extract every chunk and its size (gzipped).

3. **Check for visualizer report:**
   ```bash
   ls -la /Users/Daniel/Projects/snus-friend-shop/stats.html 2>/dev/null
   ```
   If `stats.html` exists (from rollup-plugin-visualizer), mention it can be opened in a browser.

4. **Analyze chunk sizes** — for each chunk in `dist/assets/`:
   ```bash
   ls -lhS /Users/Daniel/Projects/snus-friend-shop/dist/assets/*.js
   ```

5. **Flag large chunks:**
   - WARN: any chunk > 250KB (raw size)
   - FAIL: any chunk > 500KB (raw size)

6. **Report in table format:**

   | Chunk | Raw Size | Gzip Size | Status |
   |-------|----------|-----------|--------|
   | index-xxxxx.js | ? | ? | OK/WARN/FAIL |

7. **Suggest code-splitting opportunities** if large chunks are found:
   - React.lazy() for route-level components
   - Dynamic imports for heavy libraries (e.g., chart libraries, animation libs)
   - Check if vendor chunks could be split further in `vite.config.ts`

8. **Check vite.config.ts** for existing `manualChunks` or `rollupOptions.output` config
   and report current splitting strategy.

## Thresholds

| Size (raw) | Rating |
|------------|--------|
| < 100KB | Excellent |
| 100-250KB | Good |
| 250-500KB | Needs attention |
| > 500KB | Must split |
