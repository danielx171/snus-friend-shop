// pages/+config.ts
// Note: vike-photon requires Vite 7+ — deferred until Vite upgrade (Task N)
import vikeReact from 'vike-react/config'

export default {
  extends: [vikeReact],
  ssr: false,  // Default all pages to SPA (client-only)
  redirects: {
    '/produkt/@id': '/product/@id',
    '/produkter': '/nicotine-pouches',
    '/mappings': '/ops/mappings',
  },
}
