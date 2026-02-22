import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { useToast } from '@libs/hooks';
import { UiButton, Breadcrumb } from '@libs/ui';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DownloadIcon from '@mui/icons-material/Download';

import { useUsers } from '../hooks';
import { UserTable } from '../components/UserTable';

export const UserListPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { data: users = [], isLoading } = useUsers();

  const handleEdit = (id: number) => {
    navigate(`${id}/edit`);
  };

  const handleDelete = (id: number) => {
    // Soft delete logic can be hooked here, but it's handled via the table 'Deactivate' action if needed
    console.log('Delete/Deactivate user', id);
    toast.info('Deactivate triggered (mock)');
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
              sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}
            >
              RBAC User Management
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: 'text.secondary', maxWidth: 640 }}
            >
              Control user access levels and maintain system security integrity
              across all departments.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <UiButton
              variant="outlined"
              startIcon={<DownloadIcon />}
              sx={{ bgcolor: 'white' }}
            >
              Export
            </UiButton>
            <UiButton
              variant="contained"
              startIcon={<PersonAddIcon />}
              onClick={handleCreate}
              sx={{ boxShadow: '0px 4px 12px rgba(11, 87, 208, 0.2)' }}
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
      />
    </Box>
  );
};
