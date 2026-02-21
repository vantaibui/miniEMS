import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  HelpOutlineIcon,
  NotificationsNoneIcon,
  SearchIcon,
} from '@libs/ui';
import { useState } from 'react';
import { useAuthStore } from '@modules/auth';

interface HeaderProps {
  height?: number;
}

export const Header = ({ height = 64 }: HeaderProps) => {
  const { userProfile, logout } = useAuthStore();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  return (
    <AppBar
      position="sticky"
      elevation={0}
      color="inherit"
      sx={{ borderBottom: 1, borderColor: 'divider', height, justifyContent: 'center' }}
    >
      <Toolbar className="flex gap-4" sx={{ minHeight: height }}>
        <Box className="flex items-center gap-3 min-w-[240px]">
          <Box className="h-10 w-10 rounded-xl bg-[color:var(--color-primary)]" />
          <Box className="leading-tight">
            <Typography fontWeight={900} lineHeight={1.1}>
              TMA Insights
            </Typography>
            <Typography variant="caption" className="tracking-widest" sx={{ color: 'primary.main' }}>
              PLATFORM
            </Typography>
          </Box>
        </Box>

        <Box className="flex-1 max-w-[680px]">
          <Box className="flex items-center gap-2 rounded-xl border border-[color:var(--color-divider)] bg-white/70 px-3 py-2">
            <SearchIcon fontSize="small" />
            <InputBase className="w-full" placeholder="Search devices, users, roles..." />
          </Box>
        </Box>

        <Box className="flex items-center gap-2">
          <IconButton size="small" aria-label="Help">
            <HelpOutlineIcon />
          </IconButton>
          <IconButton size="small" aria-label="Notifications">
            <NotificationsNoneIcon />
          </IconButton>

          <button
            type="button"
            onClick={(e) => setAnchorEl(e.currentTarget)}
            className="flex items-center gap-3 rounded-xl border border-[color:var(--color-divider)] bg-white px-3 py-2"
          >
            <Box className="text-left">
              <Typography fontSize={14} fontWeight={700} lineHeight={1.2}>
                {userProfile?.fullName ?? userProfile?.username ?? 'User'}
              </Typography>
              <Typography fontSize={12} color="text.secondary" lineHeight={1.2}>
                {userProfile?.email ?? ''}
              </Typography>
            </Box>
            <Avatar sx={{ width: 32, height: 32 }} />
          </button>

          <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={() => setAnchorEl(null)}>
            <MenuItem
              onClick={() => {
                setAnchorEl(null);
                logout();
              }}
            >
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
