'use client';

import { useState, useEffect, useCallback } from 'react';
import { SessionPayload } from '../lib/auth/types';
import { apiClient, NetworkError, UnauthorizedError } from '../lib/api/client';

export interface AuthStatus extends Partial<SessionPayload> {
  authenticated: boolean;
  loading: boolean;
  error: Error | null;
  networkError: boolean;
  refetch: () => Promise<void>;
}

export function useAuthStatus(): AuthStatus {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<Partial<SessionPayload>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [networkError, setNetworkError] = useState(false);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setNetworkError(false);
      
      const data = await apiClient<{ authenticated: boolean; user?: SessionPayload }>('/api/auth/session');
      
      if (data.authenticated && data.user) {
        setAuthenticated(true);
        setUser({
          username: data.user.username,
          name: data.user.name,
          avatarUrl: data.user.avatarUrl,
        });
      } else {
        setAuthenticated(false);
        setUser({});
      }
    } catch (err: any) {
      if (err instanceof NetworkError) {
        setNetworkError(true);
      } else if (err instanceof UnauthorizedError) {
        setAuthenticated(false);
      } else {
        setError(err);
      }
      setAuthenticated(false);
      setUser({});
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    authenticated,
    loading,
    error,
    networkError,
    refetch,
    ...user,
  };
}
