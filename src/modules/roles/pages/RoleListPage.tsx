import { useToast } from '@libs/hooks';
import { AddIcon, UiBreadcrumb, UiButton } from '@libs/ui';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { RoleTable } from '../components/RoleTable';
import { useRoleDelete, useRoles } from '../hooks';

export const RoleListPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { data: roles = [], isLoading } = useRoles();
  const { mutate: deleteRole } = useRoleDelete();


  const handleEdit = (id: number) => {
    navigate(`${id}/edit`);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      deleteRole(id, {
        onSuccess: () => {
          toast.success('Role deleted successfully!');
        },
        onError: (error) => {
          toast.error(error.message || 'Failed to delete role');
        },
      });
    }
  };

  const handleCreate = () => {
    navigate('create');
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
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
            mt: 2,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}
            >
              Role Permissions Management
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: 'text.secondary', maxWidth: 640 }}
            >
              Define and manage organizational roles and granular access
              permissions for the TMA Insights platform.
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
      />
    </Box>
  );
};
