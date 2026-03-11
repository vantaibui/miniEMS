import { useToast } from '@libs/hooks';
import { AddIcon, UiBreadcrumb, UiButton, useDialogConfirm } from '@libs/ui';
import { Box, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { DeviceDetailsModal } from '../components/DeviceDetailsModal';
import { DeviceInventoryTable } from '../components/DeviceInventoryTable';
import {
  useDeviceDelete,
  useDeviceInventoryPermissions,
  useDevices,
} from '../hooks';

export const DeviceInventoryListPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const confirm = useDialogConfirm();
  const { canCreate } = useDeviceInventoryPermissions();

  const [params, setParams] = useState({
    page: 0,
    size: 10,
  });

  const [viewDeviceId, setViewDeviceId] = useState<number | undefined>(undefined);
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
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
    });

    if (!delDialog) return;

    deleteDevice(id, {
      onSuccess: (res) => {
        toast.success(res.message || 'Device deleted successfully!');
      },
    });
  };

  const handleCreate = () => {
    navigate('create');
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setViewDeviceId(undefined);
  };

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <UiBreadcrumb
          items={[
            { label: 'Dashboard', href: '/' },
            { label: 'Asset Management', href: '#' },
            { label: 'Device Inventory' },
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
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
            Device Inventory
          </Typography>

          {canCreate && (
            <UiButton variant="primary" startIcon={<AddIcon />} onClick={handleCreate}>
              Add New Device
            </UiButton>
          )}
        </Box>
      </Box>

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
    </Box>
  );
};
