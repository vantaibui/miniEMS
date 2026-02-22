import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { useToast } from '@libs/hooks';
import { UiButton, AddIcon, Breadcrumb } from '@libs/ui';
// We might need an icon for Templates
import TuneIcon from '@mui/icons-material/Tune';

import { useRoles, useRoleDelete } from '../hooks';
import { RoleTable } from '../components/RoleTable';

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
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ mb: 4 }}>
        <Breadcrumb
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
              variant="outlined"
              startIcon={<TuneIcon />}
              sx={{ bgcolor: 'white' }}
            >
              Templates
            </UiButton>
            <UiButton
              variant="primary"
              startIcon={<AddIcon />}
              onClick={handleCreate}
              sx={{ boxShadow: '0px 4px 12px rgba(11, 87, 208, 0.2)' }}
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
