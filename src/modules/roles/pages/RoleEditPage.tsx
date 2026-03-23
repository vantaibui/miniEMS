import { useState } from 'react';

import { Box, CircularProgress, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

import { PageLayout } from '@app/layout';

import { useDialogConfirm } from '@libs/ui';


import { RoleForm } from '../components/RoleForm';
import {
  usePermissionsById,
  useRoleDelete,
  useRoleDetail,
  useRoleUpdate,
} from '../hooks';

import type { BaseRolePayload, PermissionNode } from '../types';

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
    .map(({ id, actions }) => ({
      id: id,
      actions: {
        create: actions.create,
        read: actions.read,
        update: actions.update,
        delete: actions.delete,
      },
    }));
};

export const RoleEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const roleId = id ? Number(id) : undefined;
  const [pagination, setPagination] = useState({ page: 0, size: 10 });
  const confirm = useDialogConfirm();

  const { data: role, isLoading: isLoadingRole } = useRoleDetail(roleId);
  const { data: permissionsRes, isLoading: isLoadingPermissions } =
    usePermissionsById(roleId, pagination);

  const permissions = permissionsRes?.items ?? [];
  const permissionsPagination = permissionsRes?.pagination;

  const { mutate: updateRole, isPending: isUpdating } = useRoleUpdate();
  const { mutate: deleteRole, isPending: isDeleting } = useRoleDelete();

  const handleSubmit = (data: BaseRolePayload) => {
    if (!roleId) return;
    updateRole(
      { id: roleId, payload: { ...data } },
      {
        onSuccess: () => navigate('/admin/roles'),
      },
    );
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

  const isLoading =
    isLoadingRole || (isLoadingPermissions && !permissions.length);

  return (
    <PageLayout
      title={role ? `Edit Role: ${role.name}` : 'Edit Role'}
    >
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      ) : role && permissions.length > 0 ? (
        <RoleForm
          initialValues={{
            name: role.name,
            description: role.description,
            permissions: extractAllocatedPermissions(permissions),
          }}
          Permissions={permissions}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/admin/roles')}
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
    </PageLayout>
  );
};
