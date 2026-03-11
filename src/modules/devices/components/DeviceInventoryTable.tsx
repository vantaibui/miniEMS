import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  Avatar,
  Box,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import React, { useMemo, useState } from 'react';

import { UiDataTable, UiEntityTableCard, UiStatusBadge } from '@libs/ui';
import type { PaginationResult } from '@services/http';

import { useDeviceInventoryPermissions } from '../hooks/useDeviceInventoryPermissions';
import type { Device } from '../types';

interface DeviceInventoryTableProps {
  rows: Array<Device>;
  loading?: boolean;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  pagination?: PaginationResult;
  onPaginationChange: (next: { page: number; size: number }) => void;
}

const getDeviceInitials = (name: string) => {
  const chunks = name.trim().split(/[-_\s]+/).filter(Boolean);
  if (chunks.length === 0) return 'DV';

  const first = chunks[0]?.[0] ?? '';
  const second = chunks[1]?.[0] ?? '';
  return `${first}${second}`.toUpperCase();
};

export const DeviceInventoryTable = ({
  rows,
  loading,
  onView,
  onEdit,
  onDelete,
  pagination,
  onPaginationChange,
}: DeviceInventoryTableProps) => {
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [selectedDeviceId, setSelectedDeviceId] = useState<number | null>(null);

  const { canView, canEdit, canDelete } = useDeviceInventoryPermissions();

  const openMenu = (event: React.MouseEvent<HTMLElement>, deviceId: number) => {
    setMenuAnchor(event.currentTarget);
    setSelectedDeviceId(deviceId);
  };

  const blurActiveElement = () => {
    const activeElement = document.activeElement;
    if (activeElement instanceof HTMLElement) {
      activeElement.blur();
    }
  };

  const closeMenu = () => {
    blurActiveElement();
    setMenuAnchor(null);
    setSelectedDeviceId(null);
  };

  const handleViewClick = () => {
    blurActiveElement();
    if (selectedDeviceId != null) onView(selectedDeviceId);
    closeMenu();
  };

  const handleEditClick = () => {
    if (selectedDeviceId != null) onEdit(selectedDeviceId);
    closeMenu();
  };

  const handleDeleteClick = () => {
    if (selectedDeviceId != null) onDelete(selectedDeviceId);
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
          <Typography variant="body2" color="text.secondary">
            {page * size + index + 1}
          </Typography>
        ),
      },
      {
        key: 'name',
        header: 'DEVICE IDENTITY',
        render: (device: Device) => (
          <Box className="flex items-center gap-2">
            <Avatar
              sx={{ width: 40, height: 40 }}
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(device.name)}&background=random`}
            >
              {getDeviceInitials(device.name)}
            </Avatar>
            <Box>
              <Typography variant="body2" color="text.primary" className="font-semibold">
                {device.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {device.serialNumber}
              </Typography>
            </Box>
          </Box>
        ),
      },
      {
        key: 'ip',
        header: 'IP',
        render: (device: Device) => (
          <Typography variant="body2" color="text.secondary">
            {device.ip || 'N/A'}
          </Typography>
        ),
      },
      {
        key: 'model',
        header: 'MODEL',
        render: (device: Device) => (
          <Typography variant="body2" color="text.secondary">
            {device.model || 'N/A'}
          </Typography>
        ),
      },
      {
        key: 'status',
        header: 'STATUS',
        render: (device: Device) => (
          <UiStatusBadge
            status={device.status === 'Active' ? 'active' : 'inactive'}
            activeLabel="Active"
            inactiveLabel={device.status === 'Inactive' ? 'Inactive' : device.status}
          />
        ),
      },
      {
        key: 'actions',
        header: 'ACTIONS',
        align: 'right' as const,
        render: (device: Device) =>
          canView || canEdit || canDelete ? (
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
  }, [canView, canEdit, canDelete, page, size]);

  return (
    <>
      <UiEntityTableCard
        tableContent={
          <UiDataTable
            aria-label="Devices table"
            rows={rows}
            columns={columns}
            getRowId={(row) => row.id}
            loading={loading}
            pagination={
              pagination
                ? {
                    page: page,
                    rowsPerPage: size,
                    total,
                    onPageChange: (newPage) =>
                      onPaginationChange({ page: newPage, size: size }),
                    onRowsPerPageChange: (newSize) =>
                      onPaginationChange({ page: 0, size: newSize }),
                  }
                : undefined
            }
            emptyState={
              <Box className="py-10 text-center">
                <Typography variant="body2" color="text.secondary">
                  No devices found.
                </Typography>
              </Box>
            }
          />
        }
      />

      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={closeMenu}>
        {canView && (
          <MenuItem onClick={handleViewClick}>
            <ListItemIcon>
              <VisibilityIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>View Device</ListItemText>
          </MenuItem>
        )}
        {canEdit && (
          <MenuItem onClick={handleEditClick}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit Device</ListItemText>
          </MenuItem>
        )}
        {canDelete && (
          <MenuItem onClick={handleDeleteClick}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        )}
      </Menu>
    </>
  );
};
