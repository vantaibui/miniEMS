import {
  Box,
  Checkbox,
  Typography,
} from '@mui/material';
import { useCallback, useMemo } from 'react';

import { UiDataTable } from '@libs/ui';
import type { PaginationResult } from '@services/http';
import type { PermissionNode } from '../types';

interface FlatPermissionNode extends PermissionNode {
  depth: number;
}

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
  const flattenedData = useMemo(() => flattenPermissions(permissions), [permissions]);

  const handleToggle = useCallback(
    (
      id: number,
      action: 'create' | 'read' | 'update' | 'delete',
    ) => {
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
      {
        key: 'create',
        header: 'CREATE',
        width: 100,
        align: 'center' as const,
        render: (module: FlatPermissionNode) => {
          const selected = selectedPermissions.find((p) => p.id === module.id);
          const actions = selected?.actions || { create: false };
          return (
            <Checkbox
              size="small"
              checked={actions.create}
              onChange={() => handleToggle(module.id, 'create')}
              sx={
                readOnly
                  ? {
                      cursor: 'default',
                      pointerEvents: 'none',
                      '&.Mui-checked': {
                        color: 'primary.main',
                      },
                      '& .MuiSvgIcon-root': {
                        opacity: actions.create ? 1 : 0.38,
                      },
                    }
                  : {}
              }
            />
          );
        },
      },
      {
        key: 'read',
        header: 'READ',
        width: 100,
        align: 'center' as const,
        render: (module: FlatPermissionNode) => {
          const selected = selectedPermissions.find((p) => p.id === module.id);
          const actions = selected?.actions || { read: false };
          return (
            <Checkbox
              size="small"
              checked={actions.read}
              onChange={() => handleToggle(module.id, 'read')}
              sx={
                readOnly
                  ? {
                      cursor: 'default',
                      pointerEvents: 'none',
                      '&.Mui-checked': {
                        color: 'primary.main',
                      },
                      '& .MuiSvgIcon-root': {
                        opacity: actions.read ? 1 : 0.38,
                      },
                    }
                  : {}
              }
            />
          );
        },
      },
      {
        key: 'update',
        header: 'UPDATE',
        width: 100,
        align: 'center' as const,
        render: (module: FlatPermissionNode) => {
          const selected = selectedPermissions.find((p) => p.id === module.id);
          const actions = selected?.actions || { update: false };
          return (
            <Checkbox
              size="small"
              checked={actions.update}
              onChange={() => handleToggle(module.id, 'update')}
              sx={
                readOnly
                  ? {
                      cursor: 'default',
                      pointerEvents: 'none',
                      '&.Mui-checked': {
                        color: 'primary.main',
                      },
                      '& .MuiSvgIcon-root': {
                        opacity: actions.update ? 1 : 0.38,
                      },
                    }
                  : {}
              }
            />
          );
        },
      },
      {
        key: 'delete',
        header: 'DELETE',
        width: 100,
        align: 'center' as const,
        render: (module: FlatPermissionNode) => {
          const selected = selectedPermissions.find((p) => p.id === module.id);
          const actions = selected?.actions || { delete: false };
          return (
            <Checkbox
              size="small"
              checked={actions.delete}
              onChange={() => handleToggle(module.id, 'delete')}
              sx={
                readOnly
                  ? {
                      cursor: 'default',
                      pointerEvents: 'none',
                      '&.Mui-checked': {
                        color: 'primary.main',
                      },
                      '& .MuiSvgIcon-root': {
                        opacity: actions.delete ? 1 : 0.38,
                      },
                    }
                  : {}
              }
            />
          );
        },
      },
    ];
  }, [handleToggle, readOnly, selectedPermissions]);

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
          <div className="py-10 text-center">
            <Typography variant="body2" color="text.secondary">
              No permissions found.
            </Typography>
          </div>
        }
      />
    </Box>
  );
};
