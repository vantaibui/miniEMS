import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useToast } from '@libs/hooks';
import { UiBreadcrumb } from '@libs/ui';

import { useUserDetail, useUserUpdate, useUserDelete } from '../hooks';
import { usePermissions } from '../../roles/hooks';
import { UserForm } from '../components/UserForm';

export const UserEditPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
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
        onSuccess: () => {
          toast.success('User updated successfully!');
          navigate('/users');
        },
      },
    );
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ mb: 2 }}>
          <UiBreadcrumb
            items={[
              { label: 'Dashboard', href: '/' },
              { label: 'User Management', href: '/users' },
              { label: 'Edit User' },
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
          {user ? `Edit User: ${user.firstName} ${user.lastName}` : 'Edit User'}
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mt: 2 }}>
          Modify account settings and permission levels for the selected user
          profile.
        </Typography>
      </Box>

      <Box sx={{ mt: 4 }}>
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
              department: 'it', // Not present in the entity, using default mock value
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
      </Box>
    </Box>
  );
};
