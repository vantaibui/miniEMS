import { useMemo, useState } from 'react';

import {
  Avatar,
  Box,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';

import {
  DeleteIcon,
  EditOutlinedIcon,
  MoreVertIcon,
  UiDataTable,
  UiEntityTableCard,
  UiStatusBadge,
} from '@libs/ui';

import type { PaginationResult } from '@services/http';

import { useRolePermissions } from '../hooks/useRolePermissions';

import type { Role } from '../types';

export interface RoleTableProps {
  rows: Array<Role>;
  loading?: boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  pagination?: PaginationResult;
  onPaginationChange: (next: { page: number; size: number }) => void;
}

export const RoleTable = ({
  rows,
  loading,
  onEdit,
  onDelete,
  pagination,
  onPaginationChange,
}: RoleTableProps) => {
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);

  const { canEdit: canEditRole, canDelete: canDeleteRole } =
    useRolePermissions();

  const openMenu = (event: React.MouseEvent<HTMLElement>, roleId: number) => {
    setMenuAnchor(event.currentTarget);
    setSelectedRoleId(roleId);
  };

  const closeMenu = () => {
    setMenuAnchor(null);
    setSelectedRoleId(null);
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
        render: (_: Role, index: number) => (
          <Typography variant="body2" color="text.secondary">
            {page * size + index + 1}
          </Typography>
        ),
      },
      {
        key: 'name',
        header: 'ROLE NAME',
        render: (role: Role) => {
          return (
            <Box className="flex items-center gap-1.5">
              <Avatar
                sx={{ width: 40, height: 40 }}
                src={`https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(role.name)}`}
              />
              <Typography
                variant="body2"
                color="text.primary"
                className="font-semibold"
              >
                {role.name}
              </Typography>
            </Box>
          );
        },
      },
      {
        key: 'description',
        header: 'DESCRIPTION',
        render: (role: Role) => (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ maxWidth: 400 }}
            noWrap
          >
            {role.description || 'No description available for this role.'}
          </Typography>
        ),
      },
      {
        key: 'status',
        header: 'STATUS',
        render: (row: Role) => (
          <UiStatusBadge
            status={row.status ? 'active' : 'inactive'}
            activeLabel="Active"
            inactiveLabel="Inactive"
          />
        ),
      },
      {
        key: 'actions',
        header: 'ACTIONS',
        width: 80,
        align: 'right' as const,
        render: (role: Role) =>
          canEditRole || canDeleteRole ? (
            <IconButton size="small" onClick={(e) => openMenu(e, role.id)}>
              <MoreVertIcon fontSize="small" />
            </IconButton>
          ) : null,
      },
    ];
  }, [page, size, canEditRole, canDeleteRole]);

  return (
    <>
      <UiEntityTableCard
        tableContent={
          <UiDataTable
            aria-label="Roles table"
            rows={rows}
            columns={columns}
            getRowId={(role) => role.id}
            loading={loading}
            pagination={
              pagination
                ? {
                    page,
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
                  No roles found.
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
        {canEditRole && (
          <MenuItem
            onClick={() => {
              if (selectedRoleId != null) onEdit(selectedRoleId);
              closeMenu();
            }}
          >
            <ListItemIcon>
              <EditOutlinedIcon fontSize="small" />
            </ListItemIcon>
            Edit
          </MenuItem>
        )}

        {canDeleteRole && (
          <MenuItem
            onClick={() => {
              if (selectedRoleId != null) onDelete(selectedRoleId);
              closeMenu();
            }}
          >
            <ListItemIcon>
              <DeleteIcon fontSize="small" color="error" />
            </ListItemIcon>
            Delete
          </MenuItem>
        )}
      </Menu>
    </>
  );
};
