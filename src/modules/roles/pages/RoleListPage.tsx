import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { AddIcon, UiButton, useDialogConfirm } from '@libs/ui';

import { PageLayout } from '@/components/layout';

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
    <PageLayout
      title="Role Management"
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Role Management' },
      ]}
      actions={
        <UiButton
          variant="primary"
          startIcon={<AddIcon />}
          onClick={handleCreate}
        >
          Add New Role
        </UiButton>
      }
    >
      <RoleTable
        rows={roles}
        loading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        pagination={pagination}
        onPaginationChange={setParams}
      />
    </PageLayout>
  );
};
