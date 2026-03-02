import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  Box,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import React, { useMemo, useState } from 'react';

import type { PaginationResult } from '@services/http';
import { UiDataTable, UiEntityTableCard } from '@libs/ui';

import type { Device } from '../types';
import { useDeviceInventoryPermissions } from '../hooks/useDeviceInventoryPermissions';

interface DeviceInventoryTableProps {
  rows: Array<Device>;
  loading?: boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  pagination?: PaginationResult;
  onPaginationChange: (next: { page: number; size: number }) => void;
}

export const DeviceInventoryTable = ({
  rows,
  loading,
  onEdit,
  onDelete,
  pagination,
  onPaginationChange,
}: DeviceInventoryTableProps) => {
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [selectedDeviceId, setSelectedDeviceId] = useState<number | null>(null);

  const { canEdit, canDelete } = useDeviceInventoryPermissions();

  const openMenu = (event: React.MouseEvent<HTMLElement>, deviceId: number) => {
    setMenuAnchor(event.currentTarget);
    setSelectedDeviceId(deviceId);
  };

  const closeMenu = () => {
    setMenuAnchor(null);
    setSelectedDeviceId(null);
  };

  const handleEditClick = () => {
    if (onEdit && selectedDeviceId != null) onEdit(selectedDeviceId);
    closeMenu();
  };

  const handleDeleteClick = () => {
    if (onDelete && selectedDeviceId != null) onDelete(selectedDeviceId);
    closeMenu();
  };

  const total = pagination?.totalElements ?? 0;
  const page = pagination?.page ?? 0;
  const size = pagination?.size ?? 10;

  const columns = useMemo(() => {
    return [
      {
        key: '#',
        header: '#',
        width: 50,
        align: 'center' as const,
        render: (_: Device, index: number) => (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {page * size + index + 1}
          </Typography>
        ),
      },
      {
        key: 'name',
        header: 'DEVICE',
        render: (device: Device) => (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, color: 'text.primary' }}
            >
              {device.name}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: 'text.secondary' }}
            >{`SN: ${device.serialNumber}`}</Typography>
          </Box>
        ),
      },
      {
        key: 'status',
        header: 'STATUS',
        render: (device: Device) => (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              component="span"
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: device.status === 'ACTIVE' ? '#10b981' : '#9ca3af',
                display: 'inline-block',
              }}
            />
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color:
                  device.status === 'ACTIVE' ? 'text.primary' : 'text.secondary',
              }}
            >
              {device.status === 'ACTIVE' ? 'Active' : 'Inactive'}
            </Typography>
          </Box>
        ),
      },
      {
        key: 'location',
        header: 'LOCATION',
        render: (device: Device) => (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {device.location || 'N/A'}
          </Typography>
        ),
      },
      {
        key: 'lastSeenAt',
        header: 'LAST SEEN',
        render: (device: Device) => (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {device.lastSeenAt || '—'}
          </Typography>
        ),
      },
      {
        key: 'actions',
        header: 'ACTIONS',
        align: 'right' as const,
        render: (device: Device) =>
          canEdit || canDelete ? (
            <IconButton
              size="small"
              onClick={(e) => openMenu(e, device.id)}
              aria-label="Device actions"
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
          ) : null,
      },
    ];
  }, [page, size, canEdit, canDelete]);

  return (
    <>
      <UiEntityTableCard
        total={total}
        page={page}
        size={size}
        entityLabelPlural="Devices"
        filterLabel="All Device Types"
      >
        <Box>
          <UiDataTable
            aria-label="Devices table"
            rows={rows}
            columns={columns}
            getRowId={(row) => row.id}
            loading={loading}
            pagination={
              pagination
                ? {
                    page,
                    rowsPerPage: size,
                    total,
                    onPageChange: (newPage) =>
                      onPaginationChange({ page: newPage, size }),
                    onRowsPerPageChange: (newSize) =>
                      onPaginationChange({ page: 0, size: newSize }),
                  }
                : undefined
            }
            emptyState={
              <div className="py-10 text-center">
                <Typography variant="body2" color="text.secondary">
                  No devices found.
                </Typography>
              </div>
            }
          />
        </Box>
      </UiEntityTableCard>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={closeMenu}
        slotProps={{
          paper: {
            sx: {
              minWidth: 180,
              borderRadius: 2,
            },
          },
        }}
      >
        {canEdit && (
          <MenuItem onClick={handleEditClick}>
            <ListItemIcon>
              {/* Reuse generic edit icon from MUI to keep component local */}
              <MoreVertIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit Device</ListItemText>
          </MenuItem>
        )}
        {canDelete && (
          <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
            <ListItemIcon>
              <MoreVertIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

