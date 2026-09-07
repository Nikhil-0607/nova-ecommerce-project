import type { ApiError, ApiErrorCode } from "../types/api"

export type ApiClientConfig = {
  baseUrl?: string
  timeoutMs?: number
  getAuthHeader?: () => string | undefined
}

export type ApiRequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown
  timeoutMs?: number
  retry?: number
}

const errorCode = (status: number): ApiErrorCode =>
  status === 404 ? "RESOURCE_NOT_FOUND" : status >= 500 ? "SERVER_ERROR" : "VALIDATION_ERROR"

const normalizeError = (status: number, message: string, code = errorCode(status)): ApiError => ({
  code,
  message,
  status,
})

export type ApiClient = {
  request<T>(path: string, options?: ApiRequestOptions): Promise<T>
  get<T>(path: string, options?: Omit<ApiRequestOptions, "method" | "body">): Promise<T>
  post<T>(path: string, body?: unknown, options?: Omit<ApiRequestOptions, "method" | "body">): Promise<T>
}

export function createApiClient(config: ApiClientConfig = {}): ApiClient {
  const baseUrl = config.baseUrl ?? ""
  const defaultTimeout = config.timeoutMs ?? 8000

  const request = async <T>(path: string, options: ApiRequestOptions = {}): Promise<T> => {
    const attempts = Math.max(0, options.retry ?? 0) + 1
    for (let attempt = 0; attempt < attempts; attempt += 1) {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? defaultTimeout)
      try {
        const headers = new Headers(options.headers)
        headers.set("Accept", "application/json")
        if (options.body !== undefined) headers.set("Content-Type", "application/json")
        const authHeader = config.getAuthHeader?.()
        if (authHeader) headers.set("Authorization", authHeader)
        const response = await fetch(`${baseUrl}${path}`, {
          ...options,
          body: options.body === undefined ? undefined : JSON.stringify(options.body),
          headers,
          signal: controller.signal,
        })
        const text = await response.text()
        const parsed: unknown = text ? JSON.parse(text) : undefined
        if (!response.ok) {
          const message = typeof parsed === "object" && parsed !== null && "message" in parsed && typeof parsed.message === "string"
            ? parsed.message
            : response.statusText || "Request failed"
          throw normalizeError(response.status, message)
        }
        return parsed as T
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          throw normalizeError(408, "The request timed out.", "SERVER_ERROR")
        }
        if (attempt === attempts - 1) {
          if (typeof error === "object" && error !== null && "code" in error) throw error as ApiError
          throw normalizeError(0, "The request could not be completed.", "SERVER_ERROR")
        }
      } finally {
        clearTimeout(timeout)
      }
    }
    throw normalizeError(0, "The request could not be completed.", "SERVER_ERROR")
  }

  return {
    request,
    get: <T>(path: string, options: Omit<ApiRequestOptions, "method" | "body"> = {}) =>
      request<T>(path, { ...options, method: "GET", retry: options.retry ?? 1 }),
    post: <T>(path: string, body?: unknown, options: Omit<ApiRequestOptions, "method" | "body"> = {}) =>
      request<T>(path, { ...options, method: "POST", body }),
  }
}

export const apiClient = createApiClient()
