import React, { useState, useMemo } from 'react';
import {
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  TablePagination,
} from '@mui/material';

import type { PermissionNode } from '../types';

interface RolePermissionMatrixProps {
  permissions: Array<PermissionNode>;
  selectedPermissions: Array<{
    id: number;
    actions: {
      create: boolean;
      read: boolean;
      update: boolean;
      delete: boolean;
    };
  }>;
  onChange: (
    updated: Array<{
      id: number;
      actions: {
        create: boolean;
        read: boolean;
        update: boolean;
        delete: boolean;
      };
    }>,
  ) => void;
  readOnly?: boolean;
}

export const RolePermissionMatrix = ({
  permissions,
  selectedPermissions,
  onChange,
  readOnly = false,
}: RolePermissionMatrixProps) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const paginatedPermissions = useMemo(() => {
    return permissions.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage,
    );
  }, [permissions, page, rowsPerPage]);

  const handleToggle = (
    id: number,
    action: 'create' | 'read' | 'update' | 'delete',
  ) => {
    if (readOnly) return;

    const existingIndex = selectedPermissions.findIndex((p) => p.id === id);
    let updated = [...selectedPermissions];

    if (existingIndex > -1) {
      const current = updated[existingIndex];
      updated[existingIndex] = {
        ...current,
        actions: {
          ...current.actions,
          [action]: !current.actions[action],
        },
      };
    } else {
      updated.push({
        id,
        actions: {
          create: action === 'create',
          read: action === 'read',
          update: action === 'update',
          delete: action === 'delete',
        },
      });
    }
    onChange(updated);
  };

  const renderRows = (nodes: Array<PermissionNode>, depth = 0) => {
    return nodes.map((node) => {
      const selected = selectedPermissions.find((p) => p.id === node.id);
      const actions = selected?.actions || {
        create: false,
        read: false,
        update: false,
        delete: false,
      };

      return (
        <React.Fragment key={node.id}>
          <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell sx={{ pl: depth * 4 + 2 }}>
              <Typography
                variant="body2"
                sx={{ fontWeight: depth === 0 ? 600 : 400 }}
              >
                {node.name}
              </Typography>
            </TableCell>
            <TableCell align="center">
              <Checkbox
                size="small"
                checked={actions.create}
                disabled={readOnly}
                onChange={() => handleToggle(node.id, 'create')}
              />
            </TableCell>
            <TableCell align="center">
              <Checkbox
                size="small"
                checked={actions.read}
                disabled={readOnly}
                onChange={() => handleToggle(node.id, 'read')}
              />
            </TableCell>
            <TableCell align="center">
              <Checkbox
                size="small"
                checked={actions.update}
                disabled={readOnly}
                onChange={() => handleToggle(node.id, 'update')}
              />
            </TableCell>
            <TableCell align="center">
              <Checkbox
                size="small"
                checked={actions.delete}
                disabled={readOnly}
                onChange={() => handleToggle(node.id, 'delete')}
              />
            </TableCell>
          </TableRow>
          {node.children &&
            node.children.length > 0 &&
            renderRows(node.children, depth + 1)}
        </React.Fragment>
      );
    });
  };

  return (
    <TableContainer
      component={Box}
      sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}
    >
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell
              sx={{
                fontWeight: 600,
                color: 'text.secondary',
                fontSize: '0.75rem',
                letterSpacing: '0.5px',
              }}
            >
              MODULE NAME
            </TableCell>
            <TableCell
              align="center"
              sx={{
                fontWeight: 600,
                color: 'text.secondary',
                width: 100,
                fontSize: '0.75rem',
                letterSpacing: '0.5px',
              }}
            >
              CREATE
            </TableCell>
            <TableCell
              align="center"
              sx={{
                fontWeight: 600,
                color: 'text.secondary',
                width: 100,
                fontSize: '0.75rem',
                letterSpacing: '0.5px',
              }}
            >
              READ
            </TableCell>
            <TableCell
              align="center"
              sx={{
                fontWeight: 600,
                color: 'text.secondary',
                width: 100,
                fontSize: '0.75rem',
                letterSpacing: '0.5px',
              }}
            >
              UPDATE
            </TableCell>
            <TableCell
              align="center"
              sx={{
                fontWeight: 600,
                color: 'text.secondary',
                width: 100,
                fontSize: '0.75rem',
                letterSpacing: '0.5px',
              }}
            >
              DELETE
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{renderRows(paginatedPermissions)}</TableBody>
      </Table>
      <TablePagination
        component="div"
        count={permissions.length}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[5, 10, 25]}
        sx={{
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      />
    </TableContainer>
  );
};
