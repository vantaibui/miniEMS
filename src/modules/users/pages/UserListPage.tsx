import { useToast } from '@libs/hooks';
import { UiBreadcrumb, UiButton, useDialogConfirm } from '@libs/ui';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Box, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { UserTable } from '../components/UserTable';
import { useUsers, useUserDelete } from '../hooks';

export const UserListPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const confirm = useDialogConfirm();


  const { mutate: deleteUser } = useUserDelete();

  const [params, setParams] = useState({
    page: 0,
    size: 10,
  });

  const { data, isLoading } = useUsers(params);
  const users = data?.items ?? [];
  const pagination = data?.pagination;

  const handleEdit = (id: number) => {
    navigate(`${id}/edit`);
  };

  const handleDelete = async (id: number) => {
    const delDialog = await confirm({
      type: 'delete',
      title: 'Delete user',
      description: 'Are you sure you want to delete this user?',
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
    });

    if (!delDialog) return;

    deleteUser(id, {
      onSuccess: () => {
        toast.success('Role deleted successfully!');
      },
    });
  };

  const handleCreate = () => {
    navigate('create');
  };

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <UiBreadcrumb
          items={[
            { label: 'Dashboard', href: '/' },
            { label: 'Administration', href: '#' },
            { label: 'User Management' },
          ]}
        />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mt: 2,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, color: 'text.primary' }}
            >
              RBAC User Management
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <UiButton
              variant="contained"
              startIcon={<PersonAddIcon />}
              onClick={handleCreate}
            >
              Add New User
            </UiButton>
          </Box>
        </Box>
      </Box>

      <UserTable
        rows={users}
        loading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        pagination={pagination}
        onPaginationChange={setParams}
      />
    </Box>
  );
};
