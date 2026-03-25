// pages/_error/+Page.tsx
export { Page }

import { usePageContext } from 'vike-react/usePageContext'

function Page() {
  const { is404 } = usePageContext()

  if (is404) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold">404</h1>
          <p className="mt-4 text-muted-foreground">Page not found</p>
          <a href="/" className="mt-6 inline-block text-primary hover:underline">Go home</a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Something went wrong</h1>
        <p className="mt-4 text-muted-foreground">Please try refreshing the page</p>
        <a href="/" className="mt-6 inline-block text-primary hover:underline">Go home</a>
      </div>
    </div>
  )
}
