import { useMemo, useState } from 'react';

import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import {
  Avatar,
  Box,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';

import { useAuthStore, useRbacStore } from '@modules/auth';

interface HeaderProps {
  height?: number;
  title?: string;
}

export const Header = ({ height = 56, title = 'ADMINISTRATION' }: HeaderProps) => {
  const logout = useAuthStore((s) => s.logout);
  const user = useRbacStore((s) => s.user);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const { fullName, initials, role } = useMemo(() => {
    if (!user) {
      return {
        fullName: 'Admin User',
        initials: 'AU',
        role: 'Super Admin',
      };
    }

    const firstName = user.firstName ?? '';
    const lastName = user.lastName ?? '';
    const username = user.username ?? '';
    const fallbackName =
      `${firstName} ${lastName}`.trim() || username || 'Admin User';

    return {
      fullName: fallbackName,
      initials:
        `${firstName[0] ?? ''}${lastName[0] ?? ''}` ||
        `${username[0] ?? ''}`.toUpperCase() ||
        'AU',
      role: user.role ?? 'Super Admin',
    };
  }, [user]);

  return (
    <Box
      component="header"
      sx={{ height }}
      className="sticky top-0 z-[1100] flex shrink-0 items-center justify-between border-b border-divider bg-surface-card px-4 md:px-5"
    >
      <Typography
        variant="h6"
        fontWeight={700}
        className="text-text-primary"
        sx={{ letterSpacing: '0.04em' }}
      >
        {title}
      </Typography>

      <Box className="flex shrink-0 items-center">
        <Box
          component="button"
          type="button"
          onClick={(e) => setAnchorEl(e.currentTarget)}
          className="flex items-center gap-2 border-none bg-transparent p-0"
        >
          <Box className="hidden text-right md:block">
            <Typography
              variant="body2"
              className="leading-none text-text-primary"
              fontWeight={600}
            >
              {fullName}
            </Typography>
            <Typography
              variant="caption"
              className="uppercase leading-none text-text-secondary"
            >
              {role}
            </Typography>
          </Box>
          <Avatar className="h-8 w-8 bg-primary text-xs">{initials}</Avatar>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          slotProps={{
            paper: {
              className: 'mt-1 min-w-[180px] rounded-md',
            },
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
