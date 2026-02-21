import React from 'react';
import { Box, List, ListItemButton, ListItemIcon, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';

import type { NavGroup, NavItem } from '../../../navigation/nav.types';
import type { PermissionNode } from '@libs/types';
import { useRbacStore, checkPermissionRaw } from '@modules/auth';

interface SidebarNavProps {
  groups: Array<NavGroup>;
}

const isItemAllowed = (permissions: unknown, item: NavItem) => {
  if (!item.permissionPath) {
    return false;
  }
  return checkPermissionRaw(permissions as Array<PermissionNode>, item.permissionPath);
};

export const SidebarNav = ({ groups }: SidebarNavProps) => {
  const permissions = useRbacStore((s) => s.permissions);
  const isLoading = useRbacStore((s) => s.isLoading);
  const isInitialized = useRbacStore((s) => s.isInitialized);
  const error = useRbacStore((s) => s.error);
  const rbacMode = useRbacStore((s) => s.rbacMode);

  if (!isInitialized || isLoading) {
    return (
      <Box className="flex flex-col gap-3">
        {Array.from({ length: 6 }).map((_, idx) => (
          <Box
            key={idx}
            className="h-10 rounded-xl border border-(--color-divider) bg-white/60"
          />
        ))}
      </Box>
    );
  }

  if (error && rbacMode === 'strict') {
    return null;
  }

  const filteredGroups = groups
    .map((g) => ({
      ...g,
      items: g.items.filter((it) => isItemAllowed(permissions, it)),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <Box className="flex flex-col gap-6">
      {filteredGroups.map((group) => (
        <Box key={group.key}>
          {group.section && (
            <Typography
              variant="overline"
              className="text-(--mui-palette-text-secondary) font-bold tracking-widest px-2"
              sx={{ fontSize: '0.65rem' }}
            >
              {group.section}
            </Typography>
          )}

          <List dense className="mt-2 p-0">
            {group.items.map((item) => (
              <ListItemButton
                key={item.key}
                component={NavLink}
                to={item.to}
                className="rounded-xl mb-1"
                sx={{
                  '&.active': {
                    bgcolor: 'rgba(var(--mui-palette-primary-mainChannel), 0.12)',
                    color: 'primary.main',
                    '& .MuiListItemIcon-root': {
                      color: 'primary.main',
                    },
                  },
                }}
              >
                {item.icon && <ListItemIcon sx={{ minWidth: 36 }}>{typeof item.icon === 'function' ? React.createElement(item.icon as React.ComponentType<unknown>) : (item.icon as React.ReactNode)}</ListItemIcon>}
                <Typography variant="body2">{item.label}</Typography>
              </ListItemButton>
            ))}
          </List>
        </Box>
      ))}
    </Box>
  );
};
