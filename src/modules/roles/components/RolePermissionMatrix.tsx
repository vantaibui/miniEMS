import { useCallback, useMemo } from 'react';

import { Box, Checkbox, Typography } from '@mui/material';

import { UiDataTable } from '@libs/ui';

import type { PaginationResult } from '@services/http';

import type { PermissionNode } from '../types';

interface FlatPermissionNode extends PermissionNode {
  depth: number;
}

type PermissionAction = 'create' | 'read' | 'update' | 'delete';

const flattenPermissions = (
  nodes: Array<PermissionNode>,
): Array<FlatPermissionNode> => {
  return nodes.map((node) => ({ ...node, depth: 0 }));
};

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
  pagination?: PaginationResult;
  onPaginationChange?: (next: { page: number; size: number }) => void;
  loading?: boolean;
}

export const RolePermissionMatrix = ({
  permissions,
  selectedPermissions,
  onChange,
  readOnly = false,
  pagination,
  onPaginationChange,
  loading,
}: RolePermissionMatrixProps) => {
  const flattenedData = useMemo(
    () => flattenPermissions(permissions),
    [permissions],
  );

  const handleToggle = useCallback(
    (id: number, action: PermissionAction) => {
      if (readOnly) return;

      const existingIndex = selectedPermissions.findIndex((p) => p.id === id);
      const updated = [...selectedPermissions];

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
    },
    [onChange, readOnly, selectedPermissions],
  );

  const selectedPermissionsMap = useMemo(() => {
    return new Map(selectedPermissions.map((item) => [item.id, item.actions]));
  }, [selectedPermissions]);

  const actionColumns: Array<{ key: PermissionAction; header: string }> =
    useMemo(
      () => [
        { key: 'create', header: 'CREATE' },
        { key: 'read', header: 'READ' },
        { key: 'update', header: 'UPDATE' },
        { key: 'delete', header: 'DELETE' },
      ],
      [],
    );

  const renderActionCheckbox = useCallback(
    (module: FlatPermissionNode, action: PermissionAction) => {
      const actions = selectedPermissionsMap.get(module.id);
      const checked = actions?.[action] ?? false;

      return (
        <Checkbox
          size="small"
          checked={checked}
          disabled={readOnly}
          onChange={() => handleToggle(module.id, action)}
          sx={
            readOnly
              ? {
                  '&.Mui-checked': {
                    color: 'primary.main',
                  },
                  '&.Mui-disabled.Mui-checked': {
                    color: 'primary.main',
                  },
                  '&.Mui-disabled .MuiSvgIcon-root': {
                    opacity: checked ? 1 : 0.38,
                  },
                }
              : {}
          }
        />
      );
    },
    [handleToggle, readOnly, selectedPermissionsMap],
  );

  const columns = useMemo(() => {
    return [
      {
        key: 'name',
        header: 'MODULE NAME',
        render: (module: FlatPermissionNode) => (
          <Typography
            variant="body2"
            sx={{
              fontWeight: module.depth === 0 ? 600 : 400,
              pl: module.depth * 4 + 2,
              color: module.depth === 0 ? 'text.primary' : 'text.secondary',
            }}
          >
            {module.name}
          </Typography>
        ),
      },
      ...actionColumns.map((actionColumn) => ({
        key: actionColumn.key,
        header: actionColumn.header,
        width: 100,
        align: 'center' as const,
        render: (module: FlatPermissionNode) =>
          renderActionCheckbox(module, actionColumn.key),
      })),
    ];
  }, [actionColumns, renderActionCheckbox]);

  const total = pagination?.totalElements ?? flattenedData.length;
  const page = pagination?.page ?? 0;
  const size = pagination?.size ?? 10;

  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        overflow: 'hidden',
        '& .MuiTableHead-root': {
          '& .MuiTableCell-root': {
            color: 'text.secondary',
            fontSize: '0.75rem',
            fontWeight: 600,
            letterSpacing: '0.5px',
          },
        },
        '& > div': { boxShadow: 'none', borderRadius: 0 },
      }}
    >
      <UiDataTable
        aria-label="Permissions matrix"
        rows={flattenedData}
        columns={columns}
        getRowId={(module) => module.id}
        loading={loading}
        pagination={
          pagination && onPaginationChange
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
              No permissions found.
            </Typography>
          </Box>
        }
      />
    </Box>
  );
};
