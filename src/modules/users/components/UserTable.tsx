import React, { useMemo, useState } from 'react';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  Avatar,
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

import { useUserPermissions } from '../hooks';

import type { User } from '../types';
import type { PaginationResult } from '@/services/http';

interface UserTableProps {
  rows: Array<User>;
  loading?: boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  pagination?: PaginationResult;
  onPaginationChange: (next: { page: number; size: number }) => void;
}

export const UserTable = ({
  rows,
  loading,
  onEdit,
  onDelete,
  pagination,
  onPaginationChange,
}: UserTableProps) => {
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const { canEdit: canEditUser, canDelete: canDeleteUser } =
    useUserPermissions();

  const openMenu = (event: React.MouseEvent<HTMLElement>, userId: number) => {
    setMenuAnchor(event.currentTarget);
    setSelectedUserId(userId);
  };

  const closeMenu = () => {
    setMenuAnchor(null);
    setSelectedUserId(null);
  };

  const handleEditClick = () => {
    if (selectedUserId) onEdit(selectedUserId);
    closeMenu();
  };

  const handleDeleteClick = () => {
    if (selectedUserId) onDelete(selectedUserId);
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
        render: (_: User, index: number) => (
          <Typography variant="body2" color="text.secondary">
            {page * size + index + 1}
          </Typography>
        ),
      },
      {
        key: 'userIdentity',
        header: 'USER IDENTITY',
        render: (row: User) => (
          <Box className="flex items-center gap-2">
            <Avatar
              sx={{ width: 40, height: 40 }}
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(row.firstName + row.lastName)}&background=random`}
            />
            <Box>
              <Typography
                variant="body2"
                color="text.primary"
                className="font-semibold"
              >
                {row.firstName + row.lastName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {row.email}
              </Typography>
            </Box>
          </Box>
        ),
      },
      {
        key: 'status',
        header: 'STATUS',
        render: (row: User) => {
          const isActive = row.status;
          return (
            <Chip
              label={isActive ? 'Active' : 'Inactive'}
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
        key: 'lastActivity',
        header: 'LAST ACTIVITY',
        render: () => (
          <Typography variant="body2" color="text.secondary">
            Just now
          </Typography>
        ),
      },
      {
        key: 'actions',
        header: 'ACTIONS',
        align: 'right' as const,
        render: (row: User) =>
          canEditUser || canDeleteUser ? (
            <IconButton size="small" onClick={(e) => openMenu(e, row.id)}>
              <MoreVertIcon fontSize="small" />
            </IconButton>
          ) : null,
      },
    ];
  }, [page, size, canEditUser, canDeleteUser]);

  return (
    <>
      <UiEntityTableCard
        tableContent={
          <UiDataTable
            aria-label="Users table"
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
              <Box className="py-10 text-center">
                <Typography variant="body2" color="text.secondary">
                  No users found.
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
        {canEditUser && (
          <MenuItem onClick={handleEditClick}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit User</ListItemText>
          </MenuItem>
        )}
        {canDeleteUser && (
          <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
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
