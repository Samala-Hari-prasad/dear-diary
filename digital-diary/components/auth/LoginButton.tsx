"use client";

import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export function LoginButton() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogin = () => {
    const returnTo = pathname === '/' ? '' : `?returnTo=${encodeURIComponent(pathname)}`;
    router.push(`/api/auth/login${returnTo}`);
  };

  return (
    <Button onClick={handleLogin}>
      Login with GitHub
    </Button>
  );
}
