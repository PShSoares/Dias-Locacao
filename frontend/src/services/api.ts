const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001/api";

type ApiFetchInit = RequestInit & {
  token?: string;
};

export async function apiFetch<T>(
  input: string,
  init?: ApiFetchInit,
): Promise<T> {
  const { token, ...requestInit } = init ?? {};

  const response = await fetch(`${apiBaseUrl}${input}`, {
    ...requestInit,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(requestInit.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const errorPayload = await response
      .json()
      .catch(() => ({
        message: `API request failed with status ${response.status}`,
      }));

    throw new Error(
      errorPayload.message ??
        `API request failed with status ${response.status}`,
    );
  }

  return response.json() as Promise<T>;
}
