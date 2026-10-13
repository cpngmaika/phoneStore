const apiBaseUrl = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/server_war_exploded"
).replace(/\/+$/, "");

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T | undefined> {
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");

  if (
    options.body !== undefined &&
    options.body !== null &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    credentials: "include",
    headers,
  });
  const responseText = await response.text();

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
      } catch (error) {
        if (!(error instanceof SyntaxError)) {
          throw error;
        }
      }
    }

    throw new Error(
      `API request failed (${response.status})${detail ? `: ${detail}` : ""}`,
    );
  }

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
}
