import { useAuth, useRbacStore } from '@modules/auth';
import { type ReactNode, useEffect } from 'react';

interface AppInitializerProps {
  children: ReactNode;
}

export const AppInitializer = ({ children }: AppInitializerProps) => {
  const { loading } = useAuth();
  const initialize = useRbacStore((s) => s.initialize);

  useEffect(() => {
    if (!loading) {
      void initialize();
    }
  }, [loading, initialize]);

  if (loading) return null;

  return <>{children}</>;
};
