import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { type ReactNode } from 'react';
import { ToastContainer } from 'react-toastify';

import { GlobalErrorBoundary, theme } from '@libs/ui';
import { AuthProvider } from '@modules/auth'; // provides auth context and initializes RBAC
import { QueryProvider } from './QueryProvider';

export const AppCoreProvider = ({ children }: { children: ReactNode }) => {
  return (
    <GlobalErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <QueryProvider>
          <AuthProvider>
            <ToastContainer />
            {children}
          </AuthProvider>
        </QueryProvider>
      </ThemeProvider>
    </GlobalErrorBoundary>
  );
};
