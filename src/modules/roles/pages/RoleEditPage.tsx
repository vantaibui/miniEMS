import { useNavigate, useParams } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useToast } from '@libs/hooks';
import { UiBreadcrumb } from '@libs/ui';

import {
  useRoleDetail,
  useRoleUpdate,
  usePermissions,
  useRoleDelete,
  usePermissionsById,
} from '../hooks';
import { RoleForm } from '../components/RoleForm';
import type { PermissionNode, BaseRolePayload } from '../types';

const extractAllocatedPermissions = (
  nodes: Array<PermissionNode>,
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
    if (
      node.actions &&
      (node.actions.create ||
        node.actions.read ||
        node.actions.update ||
        node.actions.delete)
    ) {
      result.push({
        id: node.id,
        actions: {
          create: node.actions.create,
          read: node.actions.read,
          update: node.actions.update,
          delete: node.actions.delete,
        },
      });
    }
    if (node.subModule && node.subModule.length > 0) {
      result = [...result, ...extractAllocatedPermissions(node.subModule)];
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
    usePermissionsById(roleId);
  const { data: Permissions, isLoading: isLoadingPermissions } =
    usePermissions();
  const { mutate: updateRole, isPending: isUpdating } = useRoleUpdate();
  const { mutate: deleteRole, isPending: isDeleting } = useRoleDelete();

  const handleSubmit = (data: BaseRolePayload) => {
    if (!roleId) return;
    updateRole(
      { id: roleId, payload: { ...data, id: roleId } },
      {
        onSuccess: (response) => {
          toast.success(response.success ? response?.message : 'Role updated successfully!');
          navigate('/roles');
        },
      },
    );
  };

  const isLoading = isLoadingRole || isLoadingPermissions || isLoadingRolePerms;

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ mb: 2 }}>
          <UiBreadcrumb
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
        ) : role && Permissions ? (
          <RoleForm
            initialValues={{
              name: role.name,
              description: role.description,
              permissions: rolePermissions
                ? extractAllocatedPermissions(rolePermissions)
                : [],
            }}
            Permissions={Permissions}
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
