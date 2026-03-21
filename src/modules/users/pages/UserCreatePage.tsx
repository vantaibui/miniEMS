import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { PageLayout } from '@/components/layout';

import { usePermissions } from '../../roles/hooks';
import { UserForm } from '../components/UserForm';
import { useUserCreate } from '../hooks';

import type { CreateUserPayload } from '../types';

export const UserCreatePage = () => {
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({ page: 0, size: 10 });

  const { data: permissionsRes, isLoading: isLoadingPermissions } =
    usePermissions(pagination);

  const permissionsPagination = permissionsRes?.pagination;

  const { mutate: createUser, isPending: isCreating } = useUserCreate();

  const handleSubmit = (data: CreateUserPayload) => {
    createUser(data, {
      onSuccess: () => navigate('/users'),
    });
  };

  return (
    <PageLayout
      title="Add New User"
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'User Management', href: '/users' },
        { label: 'Add New User' },
      ]}
    >
      <UserForm
        onSubmit={handleSubmit}
        onCancel={() => navigate('/users')}
        isLoading={isCreating}
        submitLabel="Save User"
        pagination={permissionsPagination}
        onPaginationChange={setPagination}
        isPermissionsLoading={isLoadingPermissions}
      />
    </PageLayout>
  );
};
