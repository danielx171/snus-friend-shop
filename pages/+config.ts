// pages/+config.ts
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
