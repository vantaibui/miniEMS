import assets from '@/libs/assets';
import { useAuthStore, useRbacStore } from '@modules/auth';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import SearchIcon from '@mui/icons-material/Search';
import {
  AppBar,
  Avatar,
  Box,
  Divider,
  IconButton,
  InputBase,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';

interface HeaderProps {
  height?: number;
  sidebarWidth?: number;
}

export const Header = ({ height = 64, sidebarWidth = 260 }: HeaderProps) => {
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
    const fallbackName = `${firstName} ${lastName}`.trim() || username || 'Admin User';

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
    <AppBar
      position="sticky"
      elevation={0}
      color="inherit"
      sx={{ height }}
      className="z-1201 bg-surface-card text-text-primary shadow-none"
    >
      <Toolbar disableGutters className="flex min-h-16 items-center gap-2 px-2">
        <Stack direction="row" alignItems="center" spacing={1.5}>
          {/* <IconButton color="inherit" edge="start" className="mr-1 lg:hidden">
            <MenuIcon />
          </IconButton> */}

          <Box
            className="flex shrink-0 items-center"
            width={sidebarWidth}
          >
            <Box
              component="img"
              src={assets.images.miniEMSLogo}
              alt="TMA Solutions"
              className="h-13 w-auto"
            />
          </Box>
        </Stack>

        <Box className="flex flex-1 items-center px-4 md:px-6">
          <Box className="hidden h-11 w-full max-w-125 items-center gap-1 rounded-full border border-divider bg-surface-card px-2 md:flex">
            <SearchIcon fontSize="small" color="action" />
            <InputBase
              fullWidth
              placeholder="Search for users, roles, or logs."
              className="text-sm text-text-primary"
            />
          </Box>
        </Box>

        <Box className="flex shrink-0 items-center gap-1.5">
          <IconButton size="small" aria-label="Help" color="inherit">
            <HelpOutlineOutlinedIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" aria-label="Notifications" color="inherit">
            <NotificationsNoneOutlinedIcon fontSize="small" />
          </IconButton>

          <Divider
            orientation="vertical"
            flexItem
            className="mx-1 h-6 self-center"
          />

          <Box
            component="button"
            type="button"
            onClick={(e) => setAnchorEl(e.currentTarget)}
            className="ml-1 flex items-center gap-3 border-none bg-transparent p-0"
          >
            <Box className="mr-1 hidden text-right md:block">
              <Typography
                variant="body2"
                className="mb-0.5 text-sm leading-none text-text-primary"
                fontWeight={600}
              >
                {fullName}
              </Typography>
              <Typography
                variant="caption"
                className="block text-[11px] uppercase leading-none text-text-secondary"
              >
                {role}
              </Typography>
            </Box>
            <Avatar
              src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
              className="h-9 w-9 bg-primary text-sm"
            >
              {initials}
            </Avatar>
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            slotProps={{
              paper: {
                className: 'mt-1.5 min-w-[180px] rounded-md',
              },
            }}
          >
            <MenuItem onClick={() => setAnchorEl(null)}>
              <ListItemIcon>
                <Avatar className="h-6 w-6 bg-primary text-xs">
                  <AccountCircleOutlinedIcon className="text-base text-white" />
                </Avatar>
              </ListItemIcon>
              <Typography variant="body2" fontWeight={500}>
                My account
              </Typography>
            </MenuItem>

            <Divider className="my-1" />

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
      </Toolbar>
    </AppBar>
  );
};
