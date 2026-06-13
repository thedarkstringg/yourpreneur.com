'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/useAuth';
import { useStore } from '@/lib/useStore';

export function Providers({ children }: { children: React.ReactNode }) {
  const { checkSession } = useAuth();
  const { setUser } = useStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const result = await checkSession();
        if (result.authenticated && result.user) {
          setUser({
            id: result.user.id,
            email: result.user.email || '',
            fullName: result.user.user_metadata?.full_name || 'Founder',
            tier: 'free',
          });
        }
      } catch (error) {
        console.error('Auth init error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [checkSession, setUser]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
}
