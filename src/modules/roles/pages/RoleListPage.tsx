import { useState } from 'react';

import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { AddIcon, UiBreadcrumb, UiButton, useDialogConfirm } from '@libs/ui';

import { RoleTable } from '../components/RoleTable';
import { useRoleDelete, useRoles } from '../hooks';

export const RoleListPage = () => {
  const navigate = useNavigate();
  const confirm = useDialogConfirm();

  const [params, setParams] = useState({
    page: 0,
    size: 10,
  });

  const { data, isLoading } = useRoles(params);
  const roles = data?.items ?? [];
  const pagination = data?.pagination;

  const { mutate: deleteRole } = useRoleDelete();

  const handleEdit = (id: number) => {
    navigate(`${id}/edit`);
  };

  const handleDelete = async (id: number) => {
    const delDialog = await confirm({
      type: 'delete',
      title: 'Delete role',
      description: 'Are you sure you want to delete this role?',
      confirmText: 'Delete',
      cancelText: 'Cancel',
    });

    if (!delDialog) return;

    deleteRole(id);
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
            { label: 'Role Permissions Management' },
          ]}
        />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, color: 'text.primary' }}
            >
              Role Permissions Management
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <UiButton
              variant="primary"
              startIcon={<AddIcon />}
              onClick={handleCreate}
            >
              Add New Role
            </UiButton>
          </Box>
        </Box>
      </Box>

      <RoleTable
        rows={roles}
        loading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        pagination={pagination}
        onPaginationChange={setParams}
      />
    </Box>
  );
};
