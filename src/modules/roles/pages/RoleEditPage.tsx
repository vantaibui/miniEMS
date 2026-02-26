import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useToast } from '@libs/hooks';
import { UiBreadcrumb, useDialogConfirm } from '@libs/ui';

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
  return nodes
    .filter(
      (node) =>
        node.actions &&
        (node.actions.create ||
          node.actions.read ||
          node.actions.update ||
          node.actions.delete),
    )
    .map((node) => ({
      id: node.id,
      actions: {
        create: node.actions.create,
        read: node.actions.read,
        update: node.actions.update,
        delete: node.actions.delete,
      },
    }));
};

export const RoleEditPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { id } = useParams();
  const roleId = id ? Number(id) : undefined;
  const [pagination, setPagination] = useState({ page: 0, size: 10 });
  const confirm = useDialogConfirm();

  const { data: role, isLoading: isLoadingRole } = useRoleDetail(roleId);
  const { data: rolePermissionsRes, isLoading: isLoadingRolePerms } =
    usePermissionsById(roleId);
  const { data: permissionsRes, isLoading: isLoadingPermissions } =
    usePermissions(pagination);

  const permissions = permissionsRes?.items ?? [];
  const permissionsPagination = permissionsRes?.pagination;
  const rolePermissions = rolePermissionsRes?.items;

  const { mutate: updateRole, isPending: isUpdating } = useRoleUpdate();
  const { mutate: deleteRole, isPending: isDeleting } = useRoleDelete();

  const handleSubmit = (data: BaseRolePayload) => {
    if (!roleId) return;
    updateRole(
      { id: roleId, payload: { ...data, id: roleId } },
      {
        onSuccess: (response) => {
          toast.success(
            response.success ? response?.message : 'Role updated successfully!',
          );
          navigate('/roles');
        },
      },
    );
  };

  const handleDelete = async (id: number) => {
    const delDialog = await confirm({
      type: 'delete',
      title: 'Delete role',
      description: 'Are you sure you want to delete this role?',
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
    });

    if (!delDialog) return;

    deleteRole(id, {
      onSuccess: (res) => {
        toast.success(res.message || 'Role deleted successfully!');
      },
    });
  };

  const isLoading =
    isLoadingRole ||
    (isLoadingPermissions && !permissions.length) ||
    isLoadingRolePerms;

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
        ) : role && permissions.length > 0 ? (
          <RoleForm
            initialValues={{
              name: role.name,
              description: role.description,
              permissions: rolePermissions
                ? extractAllocatedPermissions(rolePermissions)
                : [],
            }}
            Permissions={permissions}
            onSubmit={handleSubmit}
            onCancel={() => navigate('/roles')}
            onDelete={() => handleDelete(role.id)}
            isLoading={isUpdating || isDeleting}
            submitLabel="Update Role"
            isEdit
            permissionsPagination={permissionsPagination}
            onPermissionsPaginationChange={setPagination}
            isPermissionsLoading={isLoadingPermissions}
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
