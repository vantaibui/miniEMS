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
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { useState } from 'react';
import { useAuthStore } from '@modules/auth/store/auth.store';
import { MenuIcon } from '@libs/ui';
import assets from '@/libs/assets';

interface HeaderProps {
  height?: number;
  sidebarWidth?: number;
}

export const Header = ({ height = 64, sidebarWidth = 260 }: HeaderProps) => {
  const { userProfile, logout } = useAuthStore();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const initials: string = userProfile?.fullName
    ? userProfile.fullName
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : userProfile?.username
      ? userProfile.username.slice(0, 2).toUpperCase()
      : 'AU';

  return (
    <AppBar
      position="sticky"
      elevation={0}
      color="inherit"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: 'background.paper',
        color: 'text.primary',
        boxShadow: 'none',
        height,
      }}
    >
      <Toolbar
        disableGutters
        sx={{
          minHeight: height,
          px: 2,
          gap: 2,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5}>
          {/* Mobile Menu Toggle */}
          <IconButton
            color="inherit"
            edge="start"
            sx={{ mr: 1, display: { lg: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo Container */}
          <Box
            sx={{
              width: { xs: 'auto', lg: sidebarWidth },
              display: 'flex',
              alignItems: 'center',
              flexShrink: 0,
            }}
          >
            <Box
              component="img"
              src={assets.images.miniEMSLogo}
              alt="TMA Solutions"
              sx={{ height: 52, width: 'auto' }}
            />
          </Box>
        </Stack>

        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            px: 4,
          }}
        >
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              gap: 1,
              height: 44,
              width: '100%',
              maxWidth: 500,
              px: 2,
              borderRadius: '22px',
              bgcolor: 'background.paper',
              border: 1,
              borderColor: 'divider',
            }}
          >
            <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
            <InputBase
              fullWidth
              placeholder="Search for users, roles, or logs."
              sx={{
                fontSize: 14,
                color: 'text.primary',
                '& .MuiInputBase-input::placeholder': {
                  opacity: 1,
                  color: 'text.secondary',
                },
              }}
            />
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            flexShrink: 0,
          }}
        >
          <IconButton
            size="small"
            aria-label="Help"
            sx={{ color: 'text.secondary' }}
          >
            <HelpOutlineOutlinedIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            aria-label="Notifications"
            sx={{ color: 'text.secondary' }}
          >
            <NotificationsNoneOutlinedIcon fontSize="small" />
          </IconButton>

          <Divider
            orientation="vertical"
            flexItem
            sx={{ mx: 1, height: 24, alignSelf: 'center' }}
          />

          <Box
            component="button"
            type="button"
            onClick={(e) => setAnchorEl(e.currentTarget)}
            className="flex items-center gap-3 ml-1"
            sx={{
              bgcolor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              p: 0,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                textAlign: 'right',
                display: { xs: 'none', md: 'block' },
                marginRight: 1,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: 'text.primary',
                  lineHeight: 1,
                  mb: 0.5,
                }}
              >
                {userProfile?.fullName ?? userProfile?.username ?? 'Admin User'}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontSize: 11,
                  color: 'text.secondary',
                  lineHeight: 1,
                  display: 'block',
                  textTransform: 'uppercase',
                }}
              >
                {(userProfile?.role as string) ?? 'Super Admin'}
              </Typography>
            </Box>
            <Avatar
              src={'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
              sx={{
                width: 36,
                height: 36,
                bgcolor: 'primary.main',
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              {initials}
            </Avatar>
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={!!anchorEl}
            onClose={() => setAnchorEl(null)}
            slotProps={{
              paper: {
                sx: {
                  mt: 1.5,
                  minWidth: 180,
                  borderRadius: 2,
                  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
                },
              },
            }}
          >
            <MenuItem onClick={() => setAnchorEl(null)} sx={{ py: 1 }}>
              <ListItemIcon>
                <Avatar
                  sx={{
                    width: 24,
                    height: 24,
                    bgcolor: 'primary.main',
                    fontSize: 12,
                  }}
                >
                  <AccountCircleOutlinedIcon
                    sx={{ fontSize: 16, color: 'white' }}
                  />
                </Avatar>
              </ListItemIcon>
              <Typography variant="body2" fontWeight={500}>
                My account
              </Typography>
            </MenuItem>

            <Divider sx={{ my: 1 }} />

            <MenuItem
              onClick={() => {
                setAnchorEl(null);
                logout();
              }}
              sx={{ py: 1 }}
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
