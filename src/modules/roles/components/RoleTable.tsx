import { DeleteIcon, EditOutlinedIcon, MoreVertIcon, UiDataTable, UiEntityTableCard } from '@libs/ui';
import {
  Avatar,
  Box,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import type { PaginationResult } from '@services/http';
import { useMemo, useState } from 'react';

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

  const { canEdit: canEditRole, canDelete: canDeleteRole } = useRolePermissions();

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
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {page * size + index + 1}
          </Typography>
        ),
      },
      {
        key: 'name',
        header: 'ROLE NAME',
        render: (role: Role) => {
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar
                sx={{ width: 40, height: 40 }}
                src={`https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(role.name)}`}
              />
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, color: 'text.primary' }}
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              component="span"
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: row.status ? '#10b981' : '#9ca3af',
                display: 'inline-block',
              }}
            />
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: row.status ? 'text.primary' : 'text.secondary',
              }}
            >
              {row.status ? 'Active' : 'Inactive'}
            </Typography>
          </Box>
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
        total={total}
        page={page}
        size={size}
        entityLabelPlural="Roles"
        filterLabel="All Role Types"
      >
        <Box>
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
                      onPaginationChange({ page: newPage, size }),
                    onRowsPerPageChange: (newSize) =>
                      onPaginationChange({ page: 0, size: newSize }),
                  }
                : undefined
            }
            emptyState={
              <div className="py-10 text-center">
                <Typography variant="body2" color="text.secondary">
                  No roles found.
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
