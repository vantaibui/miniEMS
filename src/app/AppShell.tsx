import { RouterProvider } from 'react-router-dom';

import { useAuth } from '@modules/auth';
import { GlobalErrorBoundary } from '@libs/ui';
import { AppProvider } from './providers/AppProvider';
import { router } from './router';

const App = () => {
  const { loading } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <GlobalErrorBoundary>
      <AppProvider>
        <RouterProvider router={router} />
      </AppProvider>
    </GlobalErrorBoundary>
  );
};

export default App;
