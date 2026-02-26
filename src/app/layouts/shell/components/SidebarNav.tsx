import {
  Box,
  Chip,
  List,
  ListItemButton,
  ListItemIcon,
  Typography,
} from '@mui/material';
import { NavLink, useLocation } from 'react-router-dom';

import { checkPermissionRaw, useRbacStore } from '@modules/auth';
import type { PermissionNode } from '@libs/types';
import type { NavGroup } from '../../../navigation/nav.types';
import type { ReactNode } from 'react';

interface SidebarNavProps {
  groups: Array<NavGroup>;
}

const isAllowed = (
  permissions: Array<PermissionNode> | null,
  permissionPath?: string | null,
) => {
  // Default allow if permissionPath is missing/empty
  // if (!permissionPath) {
  //   return true;
  // }
  // console.log(checkPermissionRaw(permissions, permissionPath))
  // return checkPermissionRaw(permissions, permissionPath);
  return true;
};

export const SidebarNav = ({ groups }: SidebarNavProps) => {
  const permissions = useRbacStore((s) => s.permissions);
  const isLoading = useRbacStore((s) => s.isLoading);
  const isInitialized = useRbacStore((s) => s.isInitialized);
  const error = useRbacStore((s) => s.error);
  const location = useLocation();

  if (!isInitialized || isLoading) {
    return (
      <Box className="flex flex-col gap-3">
        {Array.from({ length: 6 }).map((_, idx) => (
          <Box
            key={idx}
            className="h-10 rounded-xl border"
            sx={{
              borderColor: 'divider',
              bgcolor: 'background.paper',
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
    .filter((g) => isAllowed(permissions, g.permissionPath))
    .map((g) => ({
      ...g,
      items: g.items.filter((it) => isAllowed(permissions, it.permissionPath)),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <Box className="flex flex-col gap-6">
      {filteredGroups.map((group) => (
        <Box key={group.key}>
          {group.section && (
            <Typography
              variant="overline"
              color="text.secondary"
              className="px-2 font-bold tracking-widest"
              sx={{ fontSize: '0.65rem' }}
            >
              {group.section}
            </Typography>
          )}

          <List dense className="mt-2 p-0">
            {group.items.map((item) => {
              const isActive =
                location.pathname === item.to ||
                (item.to !== '/' &&
                  location.pathname.startsWith(`${item.to}/`));

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

                  {isActive && (
                    <Chip
                      label="Active"
                      size="small"
                      color="primary"
                      sx={{
                        height: 20,
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        borderRadius: '999px',
                      }}
                    />
                  )}
                </ListItemButton>
              );
            })}
          </List>
        </Box>
      ))}
    </Box>
  );
};
