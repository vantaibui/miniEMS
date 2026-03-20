import type { ReactNode } from 'react';

import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  Tooltip,
  Typography,
} from '@mui/material';
import { NavLink, useLocation } from 'react-router-dom';

import type { PermissionNode } from '@libs/types';

import { hasPermission, useRbacStore } from '@modules/auth';

import type { NavGroup, NavPermission } from '../../../navigation/nav.types';

interface SidebarNavProps {
  groups: Array<NavGroup>;
  compact?: boolean;
}

const isAllowed = (
  permissions: Array<PermissionNode> | null,
  permission?: NavPermission,
) => {
  // Default to allow when no permission is configured
  if (!permission) {
    return true;
  }

  const action = permission.action ?? 'read';

  return hasPermission(permissions, permission.subModule, action);
};

export const SidebarNav = ({ groups, compact = true }: SidebarNavProps) => {
  const permissions = useRbacStore((s) => s.permissions);
  const isLoading = useRbacStore((s) => s.isLoading);
  const isInitialized = useRbacStore((s) => s.isInitialized);
  const error = useRbacStore((s) => s.error);
  const location = useLocation();

  if (!isInitialized || isLoading) {
    return (
      <Box className={compact ? 'flex flex-col gap-2' : 'flex flex-col gap-3'}>
        {Array.from({ length: 6 }).map((_, idx) => (
          <Box
            key={idx}
            className={compact ? 'h-10 rounded-lg' : 'h-10 rounded-xl border'}
            sx={{
              borderColor: 'divider',
              bgcolor: compact ? 'primary.dark' : 'background.paper',
              opacity: 0.6,
            }}
          />
        ))}
      </Box>
    );
  }

  if (error) {
    return null;
  }

  const filteredGroups = groups
    .filter((g) => isAllowed(permissions, g.permission))
    .map((g) => ({
      ...g,
      items: g.items.filter((it) => isAllowed(permissions, it.permission)),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <Box className={compact ? 'flex flex-col gap-4' : 'flex flex-col gap-6'}>
      {filteredGroups.map((group) => (
        <Box key={group.key}>
          {!compact && group.section && (
            <Typography
              variant="overline"
              color="text.secondary"
              className="px-2 font-bold tracking-widest"
              sx={{ fontSize: '0.65rem' }}
            >
              {group.section}
            </Typography>
          )}

          <List dense className={compact ? 'mt-0 p-0' : 'mt-2 p-0'}>
            {group.items.map((item) => {
              const isActive =
                location.pathname === item.to ||
                (item.to !== '/' &&
                  location.pathname.startsWith(`${item.to}/`));

              if (compact) {
                return (
                  <Tooltip key={item.key} title={item.label} placement="right">
                    <ListItemButton
                      component={NavLink}
                      to={item.to}
                      className="mb-1 rounded-lg"
                      sx={{
                        minHeight: 40,
                        borderRadius: 1.5,
                        px: 0,
                        justifyContent: 'center',
                        color: 'primary.contrastText',
                        opacity: isActive ? 1 : 0.85,
                        '&:hover': {
                          bgcolor: 'primary.dark',
                          opacity: 1,
                        },
                        '&.active': {
                          bgcolor: 'primary.dark',
                          color: 'primary.contrastText',
                          opacity: 1,
                        },
                        '& .MuiListItemIcon-root': {
                          minWidth: 0,
                          color: 'inherit',
                          justifyContent: 'center',
                        },
                      }}
                    >
                      {item.icon ? (
                        <ListItemIcon>{item.icon as ReactNode}</ListItemIcon>
                      ) : (
                        <Typography variant="caption" fontWeight={600}>
                          {item.label.slice(0, 1)}
                        </Typography>
                      )}
                    </ListItemButton>
                  </Tooltip>
                );
              }

              return (
                <ListItemButton
                  key={item.key}
                  component={NavLink}
                  to={item.to}
                  className="mb-1 rounded-lg"
                  sx={{
                    minHeight: 44,
                    borderRadius: 1,
                    px: 1.5,
                    mb: 1,
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                    '&.active': {
                      bgcolor: 'action.selected',
                      color: 'primary.main',
                      '&:hover': {
                        bgcolor: 'action.selected',
                      },
                      '& .MuiListItemIcon-root': {
                        color: 'primary.main',
                      },
                    },
                  }}
                >
                  {item.icon && (
                    <ListItemIcon
                      sx={{
                        minWidth: 36,
                        color: isActive ? 'primary.main' : 'inherit',
                      }}
                    >
                      {item.icon as ReactNode}
                    </ListItemIcon>
                  )}

                  <Typography
                    variant="body2"
                    sx={{
                      flexGrow: 1,
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? 'primary.main' : 'text.primary',
                    }}
                  >
                    {item.label}
                  </Typography>
                </ListItemButton>
              );
            })}
          </List>
        </Box>
      ))}
    </Box>
  );
};
