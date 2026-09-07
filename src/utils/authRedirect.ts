export function getSafeInternalRedirect(value: string | null | undefined, fallback = "/"): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes(":")) return fallback
  return value
}

export function getCurrentInternalPath(pathname: string, search = "", hash = ""): string {
  const path = `${pathname}${search}${hash}`
  return getSafeInternalRedirect(path, "/")
}
