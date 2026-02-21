const fs = require('fs');
const path = require('path');

const modules = [
  { name: 'users', entity: 'User', endpoint: '/users' },
  { name: 'roles', entity: 'Role', endpoint: '/roles' },
  { name: 'devices', entity: 'Device', endpoint: '/devices' },
];

const basePath = path.join(__dirname, '../src/modules');

modules.forEach(({ name, entity, endpoint }) => {
  const modPath = path.join(basePath, name);
  
  // Types
  fs.writeFileSync(path.join(modPath, `types/${name.toLowerCase()}.types.ts`), `
export interface ${entity} {
  id: string | number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}
`);
  fs.writeFileSync(path.join(modPath, 'types/index.ts'), `export * from './${name.toLowerCase()}.types';\n`);

  // API
  fs.writeFileSync(path.join(modPath, `api/${name.toLowerCase()}.api.ts`), `
import { createCrudApi } from '@services/http/crudApi';
import type { ${entity} } from '../types';

export const ${name}Api = createCrudApi<${entity}>('${endpoint}');
`);
  fs.writeFileSync(path.join(modPath, 'api/index.ts'), `export * from './${name.toLowerCase()}.api';\n`);

  // Hooks
  fs.writeFileSync(path.join(modPath, `hooks/use${entity}s.ts`), `
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ${name}Api } from '../api';
import type { ${entity} } from '../types';

export const use${entity}s = () => {
  return useQuery({
    queryKey: ['${name}'],
    queryFn: () => ${name}Api.getAll(),
  });
};

export const useCreate${entity} = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<${entity}>) => ${name}Api.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['${name}'] });
    },
  });
};
`);
  fs.writeFileSync(path.join(modPath, 'hooks/index.ts'), `export * from './use${entity}s';\n`);

  // Components
  fs.writeFileSync(path.join(modPath, `components/${entity}List.tsx`), `
import { use${entity}s } from '../hooks';
import { Box, Typography, CircularProgress } from '@mui/material';

export const ${entity}List = () => {
  const { data: items, isLoading, error } = use${entity}s();

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography color="error">Failed to load ${name}</Typography>;

  return (
    <Box>
      <ul>
        {items?.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </Box>
  );
};
`);
  fs.writeFileSync(path.join(modPath, 'components/index.ts'), `export * from './${entity}List';\n`);

  // Pages
  fs.writeFileSync(path.join(modPath, `pages/${entity}ManagementPage.tsx`), `
import { Box, Typography } from '@mui/material';
import { ${entity}List } from '../components';

export const ${entity}ManagementPage = () => {
  return (
    <Box className="p-8">
      <Box className="rounded-2xl border border-(--color-divider) bg-white p-8">
        <Typography variant="h4" gutterBottom>${entity} Management</Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 4 }}>
          Manage your ${name} here.
        </Typography>
        <${entity}List />
      </Box>
    </Box>
  );
};
`);
  fs.writeFileSync(path.join(modPath, 'pages/index.ts'), `export * from './${entity}ManagementPage';\n`);

  // Routes
  fs.writeFileSync(path.join(modPath, `routes/index.tsx`), `
import type { RouteObject } from 'react-router-dom';
import { RouteGuard } from '@modules/auth';
import { ${entity}ManagementPage } from '../pages';

export const ${name}Routes: Array<RouteObject> = [
  {
    path: '${name}',
    element: (
      <RouteGuard permissionPath="ACCESS_MANAGEMENT.${name.toUpperCase()}_MANAGEMENT.read">
        <${entity}ManagementPage />
      </RouteGuard>
    ),
  },
];
`);
  
  // Index setup
  fs.writeFileSync(path.join(modPath, 'index.ts'), `
export * from './types';
export * from './api';
export * from './hooks';
export * from './components';
export * from './pages';
export { ${name}Routes } from './routes';
`);
  
  // Clean up old routes
  if (fs.existsSync(path.join(modPath, 'routes.tsx'))) {
    fs.unlinkSync(path.join(modPath, 'routes.tsx'));
  }
});

console.log('Module generation complete');
