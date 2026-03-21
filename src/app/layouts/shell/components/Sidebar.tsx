import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';

import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import {
  Avatar,
  Badge,
  Box,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from '@mui/material';

import assets from '@/libs/assets';

import { useAuthStore, useRbacStore } from '@modules/auth';

interface SidebarProps {
  width?: number;
  children?: ReactNode;
}

export const Sidebar = ({ width = 100, children }: SidebarProps) => {
  const logout = useAuthStore((s) => s.logout);
  const user = useRbacStore((s) => s.user);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const { initials } = useMemo(() => {
    if (!user) return { initials: 'AU' };
    const firstName = user.firstName ?? '';
    const lastName = user.lastName ?? '';
    const username = user.username ?? '';
    return {
      initials:
        `${firstName[0] ?? ''}${lastName[0] ?? ''}` ||
        `${username[0] ?? ''}`.toUpperCase() ||
        'AU',
    };
  }, [user]);

  return (
    <Box
      component="aside"
      className="flex shrink-0 flex-col bg-primary-dark text-primary-contrast"
      style={{ width, minWidth: width }}
    >
      <Box
        className="flex h-14 items-center justify-center border-b px-1"
        sx={{ borderColor: 'rgba(255,255,255,0.15)' }}
      >
        <Box
          component="img"
          src={assets.svgs.miniEMSSvg}
          alt="miniEMS"
          className="h-10 w-10"
        />
      </Box>

      <Box className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-1 py-2">
        {children}
      </Box>

      <Box
        className="flex flex-col items-center gap-3 border-t px-1 py-4"
        sx={{ borderColor: 'rgba(255,255,255,0.15)' }}
      >
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
