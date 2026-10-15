// In production the browser must always talk to the same origin so requests go
// through the Next.js rewrite/proxy. This keeps the session cookie first-party,
// avoids CORS, and stops a stale NEXT_PUBLIC_API_URL (e.g. a localhost URL) from
// leaking into the deployed bundle. NEXT_PUBLIC_API_URL is honored in dev only.
const configuredBase =
  process.env.NODE_ENV === "production"
    ? undefined
    : process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/+$/, "");

// No explicit base => same-origin relative base (""), resolved by the browser
// against the current origin (the rewrite proxy target).
const candidateBases = configuredBase ? [configuredBase] : [""];

let cachedBaseUrl: string | null = null;

export function getApiBaseUrl() {
  return cachedBaseUrl ?? candidateBases[0];
}

export function getApiOrigin() {
  const base = getApiBaseUrl();
  if (!base) {
    return typeof window !== "undefined" ? window.location.origin : "";
  }
  return new URL(base).origin;
}

export function getApiAssetUrl(assetUrl: string | null | undefined) {
  if (
    assetUrl?.includes("/api/product-images/") &&
    !/^[a-z][a-z\d+.-]*:/i.test(assetUrl)
  ) {
    const origin = getApiOrigin();
    return origin ? `${origin}${assetUrl}` : assetUrl;
  }
  return assetUrl;
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T | undefined> {
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");

  if (
    options.body !== undefined &&
    options.body !== null &&
    !(typeof FormData !== "undefined" && options.body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  const basesToTry = cachedBaseUrl
    ? [cachedBaseUrl, ...candidateBases.filter((b) => b !== cachedBaseUrl)]
    : candidateBases;

  let lastError: Error | null = null;

  for (const baseUrl of basesToTry) {
    try {
      const response = await fetch(`${baseUrl}${path}`, {
        ...options,
        credentials: "include",
        headers,
      });

      const responseText = await response.text();

      // If Tomcat returned an HTML 404 page ("The requested resource is not available"),
      // try the alternative base URL (e.g. "/" vs "/server_war_exploded")
      if (
        response.status === 404 &&
        (responseText.includes("Apache Tomcat") ||
          responseText.includes("The requested resource") ||
          responseText.includes("<!doctype html>"))
      ) {
        lastError = new Error(
          `API request failed (404): The requested resource [${baseUrl}${path}] is not available.`,
        );
        continue;
      }

      if (!response.ok) {
        let detail = responseText;

        if (responseText) {
          try {
            const body: unknown = JSON.parse(responseText);
            if (
              typeof body === "object" &&
              body !== null &&
              "message" in body &&
              typeof body.message === "string"
            ) {
              detail = body.message;
            }
          } catch {
            // Keep original response text as detail
          }
        }

        throw new Error(
          `API request failed (${response.status})${detail ? `: ${detail}` : ""}`,
        );
      }

      // Successful connection, cache working base URL
      cachedBaseUrl = baseUrl;

      if (!responseText) {
        return undefined;
      }

      try {
        return JSON.parse(responseText) as T;
      } catch (error) {
        if (error instanceof SyntaxError) {
          throw new Error("API returned an invalid JSON response.");
        }

        throw error;
      }
    } catch (error) {
      if (
        error instanceof TypeError &&
        (error.message.includes("fetch failed") ||
          error.message.includes("Failed to fetch"))
      ) {
        lastError = error;
        continue;
      }

      throw error;
    }
  }

  throw lastError ?? new Error("Không thể kết nối đến máy chủ API.");
}
