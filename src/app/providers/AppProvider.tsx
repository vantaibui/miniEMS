import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { type ReactNode, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';

import { QueryProvider } from './QueryProvider';
import { useRbacStore } from '@modules/auth';
import { theme } from '@libs/ui';

interface AppProviderProps {
  children: ReactNode;
}

const RbacBootstrap = ({ children }: { children: ReactNode }) => {
  const initialize = useRbacStore((s) => s.initialize);

  useEffect(() => {
    void initialize();
  }, [initialize]);

  return <>{children}</>;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastContainer />
      <QueryProvider>
        <RbacBootstrap>{children}</RbacBootstrap>
      </QueryProvider>
    </ThemeProvider>
  );
};
