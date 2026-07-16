export class OAuthStateError extends Error {
  constructor(message = 'Invalid OAuth state') {
    super(message);
    this.name = 'OAuthStateError';
  }
}

export class OAuthExchangeError extends Error {
  constructor(message = 'Failed to exchange OAuth code for token') {
    super(message);
    this.name = 'OAuthExchangeError';
  }
}

export class GitHubUserError extends Error {
  constructor(message = 'Failed to fetch GitHub user data') {
    super(message);
    this.name = 'GitHubUserError';
  }
}

export class UnauthorizedUserError extends Error {
  constructor(message = 'Unauthorized user') {
    super(message);
    this.name = 'UnauthorizedUserError';
  }
}

export class ConfigurationError extends Error {
  constructor(message = 'Authentication configuration is incomplete') {
    super(message);
    this.name = 'ConfigurationError';
  }
}
