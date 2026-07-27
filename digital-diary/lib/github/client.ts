export async function githubFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const repo = process.env.GITHUB_REPOSITORY;
  if (!repo) throw new Error("GITHUB_REPOSITORY is missing");
  const url = `https://api.github.com/repos/${repo}/${path}`;
  const pat = process.env.GITHUB_PAT;

  if (!pat) {
    throw new Error("GITHUB_PAT is missing");
  }

  const maxRetries = 3;
  let attempt = 0;

  while (attempt <= maxRetries) {
    attempt++;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          Authorization: `Bearer ${pat}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
          "X-GitHub-Api-Version": "2022-11-28",
          ...options.headers,
        },
        cache: "no-store",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error("Conflict: The file has been modified by another process. Please refresh and try again.");
        }

        const isRateLimit = response.status === 429 || (response.status === 403 && response.headers.get("x-ratelimit-remaining") === "0");
        const isServerError = response.status >= 500 && response.status <= 504;

        if ((isRateLimit || isServerError) && attempt <= maxRetries) {
          console.warn(`[GitHub API] Request failed (${response.status}). Retry attempt ${attempt}/${maxRetries}`);
          
          let delay = 1000 * Math.pow(2, attempt - 1);
          const retryAfter = response.headers.get("retry-after");
          const rateLimitReset = response.headers.get("x-ratelimit-reset");
          
          if (retryAfter) {
            delay = parseInt(retryAfter, 10) * 1000;
          } else if (rateLimitReset) {
            const resetTime = parseInt(rateLimitReset, 10) * 1000;
            const now = Date.now();
            if (resetTime > now) {
              delay = (resetTime - now) + 1000;
            }
          }
          
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        const errorText = await response.text();
        throw new Error(`GitHub API Error (${response.status}): ${errorText}`);
      }

      if (options.method === "PUT" || options.method === "POST" || options.method === "DELETE") {
        console.log(`[GitHub API] Operation ${options.method} on ${path} succeeded.`);
      }

      if (response.status === 204) {
        return {} as T;
      }

      return response.json() as Promise<T>;
    } catch (error: unknown) {
      clearTimeout(timeoutId);
      
      const isAbortError = error instanceof Error && error.name === "AbortError";
      if (isAbortError && attempt <= maxRetries) {
        console.warn(`[GitHub API] Request timed out. Retry attempt ${attempt}/${maxRetries}`);
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt - 1)));
        continue;
      }
      
      throw error;
    }
  }

  throw new Error("GitHub API request failed after maximum retries");
}
