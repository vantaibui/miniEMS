import { RouterProvider } from 'react-router-dom';

import { AppCoreProvider } from './providers/AppCoreProvider';
import { AppInitializer } from './providers/AppInitializer';
import { router } from './router';

const App = () => {
  return (
    <AppCoreProvider>
      <AppInitializer>
        <RouterProvider router={router} />
      </AppInitializer>
    </AppCoreProvider>
  );
};

export default App;
