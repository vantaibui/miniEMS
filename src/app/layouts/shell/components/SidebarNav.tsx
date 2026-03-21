import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  Tooltip,
  Typography,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

import type { PermissionNode } from '@libs/types';

import { hasPermission, useRbacStore } from '@modules/auth';

import type {
  NavPermission,
  SidebarTopItem,
} from '../../../navigation/nav.types';

interface SidebarNavProps {
  items: Array<SidebarTopItem>;
}

const isAllowed = (
  permissions: Array<PermissionNode> | null,
  permission?: NavPermission,
) => {
  if (!permission) return true;
  return hasPermission(
    permissions,
    permission.subModule,
    permission.action ?? 'read',
  );
};

export const SidebarNav = ({ items }: SidebarNavProps) => {
  const permissions = useRbacStore((s) => s.permissions);
  const isLoading = useRbacStore((s) => s.isLoading);
  const isInitialized = useRbacStore((s) => s.isInitialized);
  const error = useRbacStore((s) => s.error);
  const location = useLocation();
  const navigate = useNavigate();

  if (!isInitialized || isLoading) {
    return (
      <Box className="flex flex-col gap-2">
        {Array.from({ length: 3 }).map((_, idx) => (
          <Box
            key={idx}
            className="mx-auto h-10 w-10 rounded-lg"
            sx={{ bgcolor: 'rgba(255,255,255,0.08)' }}
          />
        ))}
      </Box>
    );
  }

  if (error) return null;

  const filteredItems = items.filter((item) =>
    isAllowed(permissions, item.permission),
  );

  const isActive = (item: SidebarTopItem) =>
    item.pathPrefixes.some(
      (prefix) =>
        location.pathname === prefix ||
        location.pathname.startsWith(`${prefix}/`),
    );

  const handleClick = (item: SidebarTopItem) => {
    if (item.to) {
      navigate(item.to);
      return;
    }
    const firstTab = item.tabs?.find((tab) =>
      isAllowed(permissions, tab.permission),
    );
    if (firstTab) navigate(firstTab.to);
  };

  return (
    <List className="flex flex-col gap-1 p-0">
      {filteredItems.map((item) => {
        const active = isActive(item);

        return (
          <Tooltip key={item.key} title={item.label} placement="right">
            <ListItemButton
              onClick={() => handleClick(item)}
              sx={{
                minHeight: 56,
                borderRadius: 1.5,
                mx: 0.5,
                px: 0.5,
                py: 1,
                flexDirection: 'column',
                gap: 0.5,
                justifyContent: 'center',
                alignItems: 'center',
                color: 'primary.contrastText',
                opacity: active ? 1 : 0.6,
                bgcolor: active
                  ? 'rgba(255,255,255,0.15)'
                  : 'transparent',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.1)',
                  opacity: 1,
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  color: 'inherit',
                  justifyContent: 'center',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <Typography
                variant="caption"
                color="inherit"
                className="text-center leading-tight"
                sx={{ fontSize: '1rem' }}
              >
                {item.label}
              </Typography>
            </ListItemButton>
          </Tooltip>
        );
      })}
    </List>
  );
};
