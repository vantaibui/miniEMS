import { useNavigate, useParams } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useToast } from '@libs/hooks';
import { Breadcrumb } from '@libs/ui';

import {
  useRoleDetail,
  useRoleUpdate,
  useAllPermissions,
  useRoleDelete,
  useRolePermissions,
} from '../hooks';
import { RoleForm } from '../components/RoleForm';
import type { PermissionNode, UpdateRolePayload } from '../types';

const extractAllocatedPermissions = (
  nodes: PermissionNode[],
): Array<{
  id: number;
  actions: { create: boolean; read: boolean; update: boolean; delete: boolean };
}> => {
  let result: Array<{
    id: number;
    actions: {
      create: boolean;
      read: boolean;
      update: boolean;
      delete: boolean;
    };
  }> = [];

  nodes.forEach((node) => {
    // Only map if there are any granted actions
    if (
      node.actions &&
      (node.actions.canCreate ||
        node.actions.canRead ||
        node.actions.canUpdate ||
        node.actions.canDelete)
    ) {
      result.push({
        id: node.id,
        actions: {
          create: node.actions.canCreate,
          read: node.actions.canRead,
          update: node.actions.canUpdate,
          delete: node.actions.canDelete,
        },
      });
    }
    if (node.children && node.children.length > 0) {
      result = [...result, ...extractAllocatedPermissions(node.children)];
    }
  });

  return result;
};

export const RoleEditPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { id } = useParams();
  const roleId = id ? Number(id) : undefined;

  const { data: role, isLoading: isLoadingRole } = useRoleDetail(roleId);
  const { data: rolePermissions, isLoading: isLoadingRolePerms } =
    useRolePermissions(roleId);
  const { data: allPermissions, isLoading: isLoadingPermissions } =
    useAllPermissions();
  const { mutate: updateRole, isPending: isUpdating } = useRoleUpdate();
  const { mutate: deleteRole, isPending: isDeleting } = useRoleDelete();

  const handleSubmit = (data: UpdateRolePayload) => {
    if (!roleId) return;
    updateRole(
      { id: roleId, payload: data },
      {
        onSuccess: () => {
          toast.success('Role updated successfully!');
          navigate('/roles');
        },
        onError: (error) => {
          toast.error(error.message || 'Failed to update role');
        },
      },
    );
  };

  const isLoading = isLoadingRole || isLoadingPermissions || isLoadingRolePerms;

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ mb: 2 }}>
          <Breadcrumb
            items={[
              { label: 'Dashboard', href: '/' },
              { label: 'Administration', href: '#' },
              { label: 'Roles & Permissions', href: '/roles' },
              { label: 'Edit Role' },
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
          {role ? `Edit Role: ${role.name}` : 'Edit Role'}
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mt: 2 }}>
          Modify security role configurations and module-level access
          permissions for the selected role.
        </Typography>
      </Box>

      <Box sx={{ mt: 4 }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
            <CircularProgress />
          </Box>
        ) : role && allPermissions ? (
          <RoleForm
            initialValues={{
              name: role.name,
              description: role.description,
              permissions: rolePermissions
                ? extractAllocatedPermissions(rolePermissions)
                : [],
            }}
            allPermissions={allPermissions}
            onSubmit={handleSubmit}
            onCancel={() => navigate('/roles')}
            onDelete={() => {
              if (
                window.confirm('Are you sure you want to delete this role?')
              ) {
                deleteRole(roleId!, {
                  onSuccess: () => {
                    toast.success('Role deleted successfully!');
                    navigate('/roles');
                  },
                  onError: (error) => {
                    toast.error(error.message || 'Failed to delete role');
                  },
                });
              }
            }}
            isLoading={isUpdating || isDeleting}
            submitLabel="Update Role"
            isEdit
          />
        ) : (
          <Typography color="error">
            Failed to load role details or permissions.
          </Typography>
        )}
      </Box>
    </Box>
  );
};
