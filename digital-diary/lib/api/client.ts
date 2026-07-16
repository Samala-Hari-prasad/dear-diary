export class UnauthorizedError extends Error {
  constructor(message: string = "Authentication required.") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class NetworkError extends Error {
  constructor(message: string = "Unable to reach the server.") {
    super(message);
    this.name = "NetworkError";
  }
}

export async function apiClient<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(input, init);
  } catch (error) {
    // If fetch throws, it's typically a network error (e.g. DNS failure, offline)
    throw new NetworkError();
  }

  if (response.status === 401) {
    throw new UnauthorizedError();
  }

  if (!response.ok) {
    let message = `API request failed with status ${response.status}`;
    try {
      const data = await response.json();
      if (data.error && data.error.message) {
        message = data.error.message;
      }
    } catch {
      // Ignore JSON parse errors for non-JSON error responses
    }
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}
