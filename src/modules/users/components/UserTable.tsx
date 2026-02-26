import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  Avatar,
  Box,
  Card,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Select,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import React, { useMemo, useState } from 'react';

import type { PaginationResult } from '@/services/http';
import { FilterListIcon, UiDataTable } from '@libs/ui';
import { useUserPermissions } from '../hooks';
import type { User } from '../types';

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
  const [tabValue, setTabValue] = useState(0);

  const { canEdit: canEditUser, canDelete: canDeleteUser } = useUserPermissions();

  const openMenu = (event: React.MouseEvent<HTMLElement>, userId: number) => {
    setMenuAnchor(event.currentTarget);
    setSelectedUserId(userId);
  };

  const closeMenu = () => {
    setMenuAnchor(null);
    setSelectedUserId(null);
  };

  const handleEditClick = () => {
    if (onEdit && selectedUserId) onEdit(selectedUserId);
    closeMenu();
  };

  const handleDeleteClick = () => {
    if (onDelete && selectedUserId) onDelete(selectedUserId);
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
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {page * size + index + 1}
          </Typography>
        ),
      },
      {
        key: 'userIdentity',
        header: 'USER IDENTITY',
        render: (row: User) => (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{ width: 40, height: 40 }}
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(row.firstName + row.lastName)}&background=random`}
            />
            <Box>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, color: 'text.primary' }}
              >
                {row.firstName}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {row.email}
              </Typography>
            </Box>
          </Box>
        ),
      },
      {
        key: 'status',
        header: 'STATUS',
        render: (row: User) => (
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
        key: 'lastActivity',
        header: 'LAST ACTIVITY',
        render: () => (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
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
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: '0px 2px 10px rgba(0,0,0,0.05)',

      }}
    >
      <Box
        sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Select
            value="All"
            size="small"
            sx={{
              minWidth: 160,
              bgcolor: 'transparent',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'divider' },
              '& .MuiSelect-select': {
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              },
              fontWeight: 600,
              fontSize: '0.875rem',
            }}
            displayEmpty
            renderValue={() => (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FilterListIcon
                  fontSize="small"
                  sx={{ color: 'text.secondary' }}
                />
                All Departments
              </Box>
            )}
          >
            <MenuItem value="All">All Departments</MenuItem>
          </Select>

          <Tabs
            value={tabValue}
            onChange={(_, val) => setTabValue(val)}
            sx={{
              minHeight: 36,
              '& .MuiTab-root': {
                minHeight: 36,
                py: 0.5,
                px: 2,
                textTransform: 'none',
                fontWeight: 500,
                color: 'text.secondary',
              },
              '& .Mui-selected': { color: 'text.primary', fontWeight: 600 },
              '& .MuiTabs-indicator': { display: 'none' },
              bgcolor: 'transparent',
            }}
          >
            <Tab label="All" />
            <Tab label="Active" />
            <Tab label="Draft" />
          </Tabs>
        </Box>
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            fontWeight: 500,
          }}
        >
          <Box
            component="span"
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: 'primary.main',
              display: 'inline-block',
            }}
          />
          Showing {page * size + 1}-{size} of {total} Users
        </Typography>
      </Box>

      <Box
        sx={{
          '& .MuiTableHead-root': {
            '& .MuiTableCell-root': {
              color: 'text.secondary',
              fontSize: '0.75rem',
              fontWeight: 600,
              bgcolor: 'transparent',
              letterSpacing: '0.5px',
            },
          },
          '& > div': { boxShadow: 'none', borderRadius: 0 },
        }}
      >
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
            <div className="py-10 text-center">
              <Typography variant="body2" color="text.secondary">
                No users found.
              </Typography>
            </div>
          }
        />
      </Box>

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
    </Card>
  );
};
