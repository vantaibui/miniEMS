import React, { useMemo, useState } from 'react';
import {
  Box,
  Card,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Tab,
  Tabs,
  Select,
  MenuItem as SelectItem,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { FilterListIcon, UiDataTable } from '@libs/ui';
import type { UiDataTableColumn } from '@libs/ui';
import type { UserEntity } from '../types';

interface UserTableProps {
  rows: Array<UserEntity>;
  loading?: boolean;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export const UserTable = ({
  rows,
  loading,
  onEdit,
  onDelete,
}: UserTableProps) => {
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const paginatedRows = useMemo(() => {
    return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [rows, page, rowsPerPage]);

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

  const getRoleBadgeColor = (role: string) => {
    const r = role.toUpperCase();
    if (r.includes('ADMIN')) return { bg: '#e8f0fe', color: '#1a73e8' };
    if (r.includes('MANAGER')) return { bg: '#f3e8fd', color: '#9333ea' };
    return { bg: '#f1f3f4', color: '#5f6368' };
  };

  const columns: Array<UiDataTableColumn<UserEntity>> = [
    {
      key: 'userIdentity',
      header: 'USER IDENTITY',
      render: (row: UserEntity) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            sx={{ width: 40, height: 40 }}
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(row.fullName)}&background=random`}
          />
          <Box>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, color: 'text.primary' }}
            >
              {row.fullName}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {row.email}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      key: 'securityRole',
      header: 'SECURITY ROLE',
      render: (row: UserEntity) => {
        const primaryRole =
          row.roles && row.roles.length > 0
            ? row.roles[0].toUpperCase()
            : 'VIEWER';
        const colors = getRoleBadgeColor(primaryRole);
        return (
          <Box
            component="span"
            sx={{
              bgcolor: colors.bg,
              color: colors.color,
              px: 1.5,
              py: 0.5,
              borderRadius: 4,
              fontSize: '0.75rem',
              fontWeight: 700,
              display: 'inline-block',
              letterSpacing: '0.5px',
            }}
          >
            {primaryRole}
          </Box>
        );
      },
    },
    {
      key: 'status',
      header: 'STATUS',
      render: (row: UserEntity) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            component="span"
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: row.isActive ? '#10b981' : '#9ca3af',
              display: 'inline-block',
            }}
          />
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: row.isActive ? 'text.primary' : 'text.secondary',
            }}
          >
            {row.isActive ? 'Active' : 'Inactive'}
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
      align: 'right',
      render: (row: UserEntity) => (
        <IconButton size="small" onClick={(e) => openMenu(e, row.id)}>
          <MoreVertIcon fontSize="small" />
        </IconButton>
      ),
    },
  ];

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: '0px 2px 10px rgba(0,0,0,0.05)',
        overflow: 'hidden',
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
            renderValue={(value) => (
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
              '& .MuiTabs-indicator': { display: 'none' }, // Using background indicator conceptually or simply hidden for tabs
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
          Showing {rows.length === 0 ? 0 : page * rowsPerPage + 1}-
          {Math.min((page + 1) * rowsPerPage, rows.length)} of {rows.length}{' '}
          Users
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
          rows={paginatedRows}
          columns={columns}
          getRowId={(row) => row.id}
          loading={loading}
          selectable={true}
          pagination={{
            page,
            rowsPerPage,
            total: rows.length,
            onPageChange: (newPage) => setPage(newPage),
            onRowsPerPageChange: (newRowsPerPage) => {
              setRowsPerPage(newRowsPerPage);
              setPage(0);
            },
          }}
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
        <MenuItem onClick={handleEditClick}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit User</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Deactivate</ListItemText>
        </MenuItem>
      </Menu>
    </Card>
  );
};
