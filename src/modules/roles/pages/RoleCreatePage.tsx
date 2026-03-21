import { useState } from 'react';

import { Box, CircularProgress, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { PageLayout } from '@app/layout';

import { RoleForm } from '../components/RoleForm';
import { usePermissions, useRoleCreate } from '../hooks';

import type { CreateRolePayload } from '../types';

export const RoleCreatePage = () => {
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({ page: 0, size: 10 });

  const { data: permissionsRes, isLoading: isLoadingPermissions } =
    usePermissions(pagination);

  const permissions = permissionsRes?.items ?? [];
  const permissionsPagination = permissionsRes?.pagination;

  const { mutate: createRole, isPending: isCreating } = useRoleCreate();

  const handleSubmit = (data: CreateRolePayload) => {
    createRole(data, {
      onSuccess: () => navigate('/admin/roles'),
    });
  };

  return (
    <PageLayout
      title="Add New Role"
      description="Define a new security role and configure specific module-level access permissions."
    >
      {isLoadingPermissions && !permissions.length ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      ) : permissions.length > 0 ? (
        <RoleForm
          Permissions={permissions}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/admin/roles')}
          isLoading={isCreating}
          submitLabel="Create Role"
          permissionsPagination={permissionsPagination}
          onPermissionsPaginationChange={setPagination}
          isPermissionsLoading={isLoadingPermissions}
        />
      ) : (
        <Typography color="error">Failed to load permissions.</Typography>
      )}
    </PageLayout>
  );
};
