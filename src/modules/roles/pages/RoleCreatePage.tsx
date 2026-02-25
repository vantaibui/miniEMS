import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useToast } from '@libs/hooks';
import { UiBreadcrumb } from '@libs/ui';

import { useRoleCreate, usePermissions } from '../hooks';
import { RoleForm } from '../components/RoleForm';
import type { CreateRolePayload } from '../types';

export const RoleCreatePage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [pagination, setPagination] = useState({ page: 0, size: 10 });

  const { data: permissionsRes, isLoading: isLoadingPermissions } =
    usePermissions(pagination);
  
  const permissions = permissionsRes?.items ?? [];
  const permissionsPagination = permissionsRes?.pagination;

  const { mutate: createRole, isPending: isCreating } = useRoleCreate();

  const handleSubmit = (data: CreateRolePayload) => {
    createRole(data, {
      onSuccess: (response) => {
        toast.success(
          response.success ? response?.message : 'Role created successfully!',
        );
        navigate('/roles');
      },
    });
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ mb: 2 }}>
          <UiBreadcrumb
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
        {isLoadingPermissions && !permissions.length ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
            <CircularProgress />
          </Box>
        ) : permissions.length > 0 ? (
          <RoleForm
            Permissions={permissions}
            onSubmit={handleSubmit}
            onCancel={() => navigate('/roles')}
            isLoading={isCreating}
            submitLabel="Create Role"
            permissionsPagination={permissionsPagination}
            onPermissionsPaginationChange={setPagination}
            isPermissionsLoading={isLoadingPermissions}
          />
        ) : (
          <Typography color="error">Failed to load permissions.</Typography>
        )}
      </Box>
    </Box>
  );
};
