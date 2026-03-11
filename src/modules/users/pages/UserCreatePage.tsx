import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useToast } from '@libs/hooks';
import { UiBreadcrumb } from '@libs/ui';

import { useUserCreate } from '../hooks';
import { UserForm } from '../components/UserForm';
import { usePermissions } from '../../roles/hooks';
import type { CreateUserPayload } from '../types';

export const UserCreatePage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [pagination, setPagination] = useState({ page: 0, size: 10 });

  const { data: permissionsRes, isLoading: isLoadingPermissions } =
    usePermissions(pagination);

  const permissionsPagination = permissionsRes?.pagination;

  const { mutate: createUser, isPending: isCreating } = useUserCreate();

  const handleSubmit = (data: CreateUserPayload) => {
    createUser(data, {
      onSuccess: () => {
        toast.success('User created successfully!');
        navigate('/users');
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to create user');
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
              { label: 'User Management', href: '/users' },
              { label: 'Add New User' },
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
          Add New User
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mt: 2 }}>
          Create a new user profile and define their system-wide access
          permissions.
        </Typography>
      </Box>

      <Box sx={{ mt: 4 }}>
        <UserForm
          onSubmit={handleSubmit}
          onCancel={() => navigate('/users')}
          isLoading={isCreating}
          submitLabel="Save User"
          pagination={permissionsPagination}
          onPaginationChange={setPagination}
          isPermissionsLoading={isLoadingPermissions}
        />
      </Box>
    </Box>
  );
};
