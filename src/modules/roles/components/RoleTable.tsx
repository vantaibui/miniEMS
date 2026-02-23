import {
  Avatar,
  Box,
  Card,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Select,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';

import { DeleteOutlineIcon, EditOutlinedIcon, MoreVertIcon, UiDataTable } from '@libs/ui';
import FilterListIcon from '@mui/icons-material/FilterList';

import type { Role } from '../types';

export interface RoleTableProps {
  rows: Array<Role>;
  loading?: boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}
export const RoleTable = ({
  rows,
  loading,
  onEdit,
  onDelete,
}: RoleTableProps) => {
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const paginatedRows = useMemo(() => {
    return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [rows, page, rowsPerPage]);

  const openMenu = (event: React.MouseEvent<HTMLElement>, roleId: number) => {
    setMenuAnchor(event.currentTarget);
    setSelectedRoleId(roleId);
  };

  const closeMenu = () => {
    setMenuAnchor(null);
    setSelectedRoleId(null);
  };

  const columns = useMemo(() => {
    return [
      {
        key: 'name',
        header: 'ROLE NAME',
        render: (role: Role) => {
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar
                sx={{ width: 30, height: 30 }}
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
        key: 'assignedUsers',
        header: 'ASSIGNED USERS',
        width: 150,
        render: () => (
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, color: 'text.primary' }}
          >
            {Math.floor(Math.random() * 300) + 12}{' '}
            <Typography
              component="span"
              variant="body2"
              sx={{ color: 'text.secondary', fontWeight: 400 }}
            >
              Users
            </Typography>
          </Typography>
        ),
      },
      {
        key: 'actions',
        header: 'ACTIONS',
        width: 80,
        align: 'right' as const,
        render: (role: Role) => (
          <IconButton size="small" onClick={(e) => openMenu(e, role.id)}>
            <MoreVertIcon fontSize="small" />
          </IconButton>
        ),
      },
    ];
  }, []);

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: '0px 2px 10px rgba(0,0,0,0.05)',
        mb: 4,
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
            renderValue={() => (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FilterListIcon
                  fontSize="small"
                  sx={{ color: 'text.secondary' }}
                />
                All Role Types
              </Box>
            )}
          >
            <MenuItem value="All">All Role Types</MenuItem>
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
          Roles
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
          aria-label="Roles table"
          rows={paginatedRows}
          columns={columns}
          getRowId={(role) => role.id}
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
                No roles found.
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

        <MenuItem
          onClick={() => {
            if (selectedRoleId != null) onDelete(selectedRoleId);
            closeMenu();
          }}
        >
          <ListItemIcon>
            <DeleteOutlineIcon fontSize="small" />
          </ListItemIcon>
          Delete
        </MenuItem>
      </Menu>
    </Card>
  );
};
