import React, { useMemo, useState } from 'react';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  Box,
  Chip,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';

import { UiDataTable, UiEntityTableCard } from '@libs/ui';
import { DATE_FORMATS, formatUtcOrFallback } from '@libs/utils';

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
        header: 'NAME',
        render: ({ name }: Device) => (
          <Typography
            variant="body2"
            color="text.primary"
            className="font-semibold"
          >
            {name || 'N/A'}
          </Typography>
        ),
      },
      {
        key: 'serialNumber',
        header: 'SERIAL NUMBER',
        render: ({ serialNumber }: Device) => (
          <Typography variant="body2" color="text.secondary">
            {serialNumber || 'N/A'}
          </Typography>
        ),
      },
      {
        key: 'ip',
        header: 'IP',
        render: ({ managementIp }: Device) => (
          <Typography variant="body2" color="text.secondary">
            {managementIp || 'N/A'}
          </Typography>
        ),
      },
      {
        key: 'model',
        header: 'MODEL',
        render: ({ model }: Device) => (
          <Typography variant="body2" color="text.secondary">
            {model || 'N/A'}
          </Typography>
        ),
      },
      {
        key: 'status',
        header: 'STATUS',
        render: ({ status }: Device) => {
          const isActive = status.value === 'IN_SERVICE';
          const label = status.display || status.value || 'N/A';
          return (
            <Chip
              label={label}
              sx={{
                height: 28,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 0.8,
                px: 1.5,
                borderRadius: 999,
                bgcolor: isActive ? '#D1FAE5' : '#FEE2E2',
                color: isActive ? '#047857' : '#B91C1C',
              }}
            />
          );
        },
      },
      {
        key: 'lastModifiedDate',
        header: 'LAST UPDATE',
        render: ({ lastModifiedDate }: Device) => (
          <Typography variant="body2" color="text.secondary">
            {formatUtcOrFallback(
              lastModifiedDate,
              DATE_FORMATS.DISPLAY_DATE_TIME,
            )}
          </Typography>
        ),
      },
      {
        key: 'actions',
        header: 'Actions',
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

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={closeMenu}
      >
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
