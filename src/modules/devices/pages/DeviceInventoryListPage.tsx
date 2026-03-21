import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { AddIcon, UiButton, useDialogConfirm } from '@libs/ui';

import { PageLayout } from '@/components/layout';

import { DeviceDetailsModal } from '../components/DeviceDetailsModal';
import { DeviceInventoryTable } from '../components/DeviceInventoryTable';
import {
  useDeviceDelete,
  useDeviceInventoryPermissions,
  useDevices,
} from '../hooks';

export const DeviceInventoryListPage = () => {
  const navigate = useNavigate();
  const confirm = useDialogConfirm();
  const { canCreate } = useDeviceInventoryPermissions();

  const [params, setParams] = useState({
    page: 0,
    size: 10,
  });

  const [viewDeviceId, setViewDeviceId] = useState<number | undefined>(
    undefined,
  );
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const { data, isLoading } = useDevices(params);
  const { mutate: deleteDevice } = useDeviceDelete();

  const rows = data?.items ?? [];
  const pagination = data?.pagination;

  const handleView = (id: number) => {
    setViewDeviceId(id);
    setIsViewModalOpen(true);
  };

  const handleEdit = (id: number) => {
    navigate(`${id}/edit`);
  };

  const handleDelete = async (id: number) => {
    const delDialog = await confirm({
      type: 'delete',
      title: 'Delete device',
      description: 'Are you sure you want to delete this device?',
      confirmText: 'Delete',
      cancelText: 'Cancel',
    });

    if (!delDialog) return;

    deleteDevice(id);
  };

  const handleCreate = () => {
    navigate('create');
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setViewDeviceId(undefined);
  };

  return (
    <PageLayout
      title="Device Inventory"
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Device Management' },
      ]}
      actions={
        canCreate ? (
          <UiButton
            variant="primary"
            startIcon={<AddIcon />}
            onClick={handleCreate}
          >
            Add New Device
          </UiButton>
        ) : undefined
      }
    >
      <DeviceInventoryTable
        rows={rows}
        loading={isLoading}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        pagination={pagination}
        onPaginationChange={setParams}
      />

      <DeviceDetailsModal
        open={isViewModalOpen}
        deviceId={viewDeviceId}
        onClose={handleCloseViewModal}
      />
    </PageLayout>
  );
};
