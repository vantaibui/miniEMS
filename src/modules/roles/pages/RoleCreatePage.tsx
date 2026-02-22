import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useToast } from '@libs/hooks';
import { Breadcrumb } from '@libs/ui';

import { useRoleCreate, useAllPermissions } from '../hooks';
import { RoleForm } from '../components/RoleForm';
import type { CreateRolePayload } from '../types';

export const RoleCreatePage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { data: allPermissions, isLoading: isLoadingPermissions } =
    useAllPermissions();
  const { mutate: createRole, isPending: isCreating } = useRoleCreate();

  const handleSubmit = (data: CreateRolePayload) => {
    createRole(data, {
      onSuccess: () => {
        toast.success('Role created successfully!');
        navigate('/roles');
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to create role');
      },
    });
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ mb: 2 }}>
          <Breadcrumb
            items={[
              { label: 'Dashboard', href: '/' },
              { label: 'Administration', href: '#' },
              { label: 'Roles & Permissions', href: '/roles' },
              { label: 'Add New Role' },
            ]}
          />
        </Box>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: 'text.primary',
            mb: 1,
            display: 'inline-block',
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -4,
              left: 0,
              width: '40px',
              height: '3px',
              bgcolor: 'primary.main',
              borderRadius: '2px',
            },
          }}
        >
          Add New Role
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mt: 2 }}>
          Define a new security role and configure specific module-level access
          permissions.
        </Typography>
      </Box>

      <Box sx={{ mt: 4 }}>
        {isLoadingPermissions ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
            <CircularProgress />
          </Box>
        ) : allPermissions ? (
          <RoleForm
            allPermissions={allPermissions}
            onSubmit={handleSubmit}
            onCancel={() => navigate('/roles')}
            isLoading={isCreating}
            submitLabel="Create Role"
          />
        ) : (
          <Typography color="error">Failed to load permissions.</Typography>
        )}
      </Box>
    </Box>
  );
};
