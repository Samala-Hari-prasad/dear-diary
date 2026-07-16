export interface SessionPayload {
  sub: string; // GitHub user ID
  username: string;
  iat: number; // issued at (seconds since epoch)
  exp: number; // expiration (seconds since epoch)
  name?: string;
  avatarUrl?: string;
}

export interface GitHubUser {
  id: string;
  login: string;
  name?: string;
  avatar_url?: string;
}
