import { useMemo, useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Typography,
  Box,
  Card,
  Tabs,
  Tab,
  Select,
  Avatar,
} from '@mui/material';

import { UiDataTable } from '@libs/ui';
import { MoreVertIcon, EditOutlinedIcon, DeleteOutlineIcon } from '@libs/ui';
import SecurityIcon from '@mui/icons-material/Security';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import CodeIcon from '@mui/icons-material/Code';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import FilterListIcon from '@mui/icons-material/FilterList';

import type { RoleEntity } from '../types';

export interface RoleTableProps {
  rows: Array<RoleEntity>;
  loading?: boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const getRoleIconAndColor = (name: string) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('admin')) {
    return {
      icon: <SecurityIcon fontSize="small" />,
      color: '#0b57d0',
      bgcolor: '#e8f0fe',
    };
  }
  if (lowerName.includes('manager')) {
    return {
      icon: <WorkOutlineIcon fontSize="small" />,
      color: '#65558f',
      bgcolor: '#f3e8fd',
    };
  }
  if (lowerName.includes('developer')) {
    return {
      icon: <CodeIcon fontSize="small" />,
      color: '#118a4a',
      bgcolor: '#e6f4ea',
    };
  }
  return {
    icon: <PersonOutlineIcon fontSize="small" />,
    color: '#0b57d0',
    bgcolor: '#e8f0fe',
  };
};

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
        render: (row: RoleEntity) => {
          const { icon, color, bgcolor } = getRoleIconAndColor(row.name);
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar
                variant="rounded"
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor,
                  color,
                  borderRadius: 1.5,
                }}
              >
                {icon}
              </Avatar>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, color: 'text.primary' }}
              >
                {row.name}
              </Typography>
            </Box>
          );
        },
      },
      {
        key: 'description',
        header: 'DESCRIPTION',
        render: (row: RoleEntity) => (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ maxWidth: 400 }}
            noWrap
          >
            {row.description || 'No description available for this role.'}
          </Typography>
        ),
      },
      {
        key: 'assignedUsers',
        header: 'ASSIGNED USERS',
        width: 150,
        render: (_row: RoleEntity) => (
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
        render: (row: RoleEntity) => (
          <IconButton size="small" onClick={(e) => openMenu(e, row.id)}>
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
            renderValue={(value) => (
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
          '& > div': { boxShadow: 'none', borderRadius: 0 }, // To remove UiCard styling if any
        }}
      >
        <UiDataTable
          aria-label="Roles table"
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
