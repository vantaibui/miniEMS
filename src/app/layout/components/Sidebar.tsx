import { useMemo, useState } from 'react';

import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import {
  Avatar,
  Badge,
  Box,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

import type { NavPermission, SidebarTopItem } from '@app/navigation';

import type { PermissionNode } from '@libs/types';

import { hasPermission, useAuthStore, useRbacStore } from '@modules/auth';

import assets from '@/libs/assets';



export interface SidebarProps {
  width?: number;
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

const isItemAllowed = (
  permissions: Array<PermissionNode> | null,
  item: SidebarTopItem,
) => {
  if (item.permissionAnyOf?.length) {
    return item.permissionAnyOf.some((p) => isAllowed(permissions, p));
  }
  return isAllowed(permissions, item.permission);
};

export const Sidebar = ({ width = 100, items }: SidebarProps) => {
  const logout = useAuthStore((s) => s.logout);
  const user = useRbacStore((s) => s.user);
  const permissions = useRbacStore((s) => s.permissions);
  const isLoading = useRbacStore((s) => s.isLoading);
  const isInitialized = useRbacStore((s) => s.isInitialized);
  const error = useRbacStore((s) => s.error);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const initials = useMemo(() => {
    if (!user) return 'AU';
    const f = user.firstName?.[0] ?? '';
    const l = user.lastName?.[0] ?? '';
    return `${f}${l}` || user.username?.[0]?.toUpperCase() || 'AU';
  }, [user]);

  const visibleItems = items.filter((item) => isItemAllowed(permissions, item));

  const isActive = (item: SidebarTopItem) =>
    item.pathPrefixes.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
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
    <Box
      component="aside"
      className="flex shrink-0 flex-col bg-primary-dark text-primary-contrast"
      style={{ width, minWidth: width }}
    >
      <Box className="flex h-14 items-center justify-center border-b border-white/15 px-1">
        <Box
          component="img"
          src={assets.svgs.miniEMSSvg}
          alt="miniEMS"
          className="h-10 w-10"
        />
      </Box>

      <Box className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-1 py-2">
        {!isInitialized || isLoading ? (
          <Box className="flex flex-col gap-2">
            {Array.from({ length: 2 }).map((_, idx) => (
              <Box
                key={idx}
                className="mx-auto h-10 w-10 rounded-lg"
                sx={{ bgcolor: 'rgba(255,255,255,0.08)' }}
              />
            ))}
          </Box>
        ) : error ? null : (
          <List className="flex flex-col gap-1 p-0">
            {visibleItems.map((item) => {
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
                      bgcolor: active ? 'rgba(255,255,255,0.15)' : 'transparent',
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
                      className="text-center text-base leading-tight"
                    >
                      {item.label}
                    </Typography>
                  </ListItemButton>
                </Tooltip>
              );
            })}
          </List>
        )}
      </Box>

      <Box className="flex flex-col items-center gap-3 border-t border-white/15 px-1 py-4">
        <Tooltip title="Notifications" placement="right">
          <IconButton sx={{ color: 'primary.contrastText' }}>
            <Badge color="error" variant="dot" overlap="circular">
              <NotificationsNoneOutlinedIcon sx={{ fontSize: 26 }} />
            </Badge>
          </IconButton>
        </Tooltip>

        <Tooltip title="Account" placement="right">
          <IconButton
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{ p: 0 }}
          >
            <Avatar
              className="h-10 w-10 text-sm"
              sx={{ bgcolor: 'success.light', color: 'common.white' }}
            >
              {initials}
            </Avatar>
          </IconButton>
        </Tooltip>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{ vertical: 'center', horizontal: 'right' }}
          transformOrigin={{ vertical: 'center', horizontal: 'left' }}
          slotProps={{
            paper: { className: 'ml-2 min-w-[180px] rounded-md' },
          }}
        >
          <MenuItem onClick={() => setAnchorEl(null)}>
            <ListItemIcon>
              <AccountCircleOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <Typography variant="body2" fontWeight={500}>
              My account
            </Typography>
          </MenuItem>
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              logout();
            }}
          >
            <ListItemIcon>
              <LogoutOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <Typography variant="body2" fontWeight={500}>
              Logout
            </Typography>
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};
