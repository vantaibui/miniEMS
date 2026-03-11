import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import { type ReactNode } from 'react';
import { ToastContainer } from 'react-toastify';

import { ConfirmDialogProvider, GlobalErrorBoundary, theme } from '@libs/ui';
import { AuthProvider } from '@modules/auth'; // provides auth context and initializes RBAC
import { QueryProvider } from './QueryProvider';

const muiCache = createCache({ key: 'mui', prepend: true });

export const AppCoreProvider = ({ children }: { children: ReactNode }) => {
  return (
    <CacheProvider value={muiCache}>
      <StyledEngineProvider injectFirst>
    <GlobalErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <QueryProvider>
          <AuthProvider>
            <ConfirmDialogProvider>
            <ToastContainer />
            {children}
            </ConfirmDialogProvider>
          </AuthProvider>
        </QueryProvider>
      </ThemeProvider>
    </GlobalErrorBoundary>
      </StyledEngineProvider>
    </CacheProvider>
  );
};
