import { useState } from 'react';

import { Box, CircularProgress, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

import { PageLayout } from '@/components/layout';

import { usePermissions } from '../../roles/hooks';
import { UserForm } from '../components/UserForm';
import { useUserDelete, useUserDetail, useUserUpdate } from '../hooks';

export const UserEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const userId = id ? Number(id) : undefined;

  const [pagination, setPagination] = useState({ page: 0, size: 10 });

  const { data: user, isLoading: isLoadingUser } = useUserDetail(userId || '');
  const { mutate: updateUser, isPending: isUpdating } = useUserUpdate();
  const { mutate: deleteUser, isPending: isDeleting } = useUserDelete();

  const { data: permissions, isLoading: isLoadingPermissions } =
    usePermissions(pagination);
  const permissionsPagination = permissions?.pagination;

  const handleSubmit = (data: import('../types').CreateUserPayload) => {
    if (!userId) return;
    updateUser(
      { id: userId, payload: data },
      {
        onSuccess: () => navigate('/users'),
      },
    );
  };

  return (
    <PageLayout
      title={
        user ? `Edit User: ${user.firstName} ${user.lastName}` : 'Edit User'
      }
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'User Management', href: '/users' },
        { label: 'Edit User' },
      ]}
    >
      {isLoadingUser ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      ) : user ? (
        <UserForm
          initialValues={{
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            username: user.username,
            email: user.email,
            roleId: user.roleId,
          }}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/users')}
          onDelete={() => deleteUser(user.id)}
          isLoading={isUpdating || isDeleting}
          submitLabel="Update User"
          isEdit
          pagination={permissionsPagination}
          onPaginationChange={setPagination}
          isPermissionsLoading={isLoadingPermissions}
        />
      ) : (
        <Typography color="error">Failed to load user details.</Typography>
      )}
    </PageLayout>
  );
};
