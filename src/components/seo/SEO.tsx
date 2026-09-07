import { useEffect } from "react"

export type SEOProps = {
  title: string
  description: string
  canonicalPath?: string
  robots?: string
  structuredData?: Record<string, unknown>
}

const siteName = "NOVA"

function upsertMeta(name: string, content: string, attribute = "name") {
  let element = document.head.querySelector(`meta[${attribute}="${name}"]`)
  if (!element) {
    element = document.createElement("meta")
    element.setAttribute(attribute, name)
    document.head.appendChild(element)
  }
  element.setAttribute("content", content)
}

function upsertCanonical(path?: string) {
  if (!path) return
  const url = new URL(path, window.location.origin)
  url.search = ""
  url.hash = ""
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!link) {
    link = document.createElement("link")
    link.rel = "canonical"
    document.head.appendChild(link)
  }
  link.href = url.toString()
}

export default function SEO({ title, description, canonicalPath, robots = "index,follow", structuredData }: SEOProps) {
  useEffect(() => {
    document.title = title
    upsertMeta("description", description)
    upsertMeta("robots", robots)
    upsertMeta("og:title", title, "property")
    upsertMeta("og:description", description, "property")
    upsertMeta("og:type", "website", "property")
    upsertMeta("og:site_name", siteName, "property")
    upsertCanonical(canonicalPath)

    const existing = document.head.querySelector('script[data-nova-structured-data="true"]')
    existing?.remove()
    if (structuredData) {
      const script = document.createElement("script")
      script.type = "application/ld+json"
      script.dataset.novaStructuredData = "true"
      script.textContent = JSON.stringify(structuredData)
      document.head.appendChild(script)
    }
    return () => {
      document.head.querySelector('script[data-nova-structured-data="true"]')?.remove()
    }
  }, [canonicalPath, description, robots, structuredData, title])

  return null
}
