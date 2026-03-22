
import { Link as RouterLink } from 'react-router-dom';

import { getPageTitle, PAGE_TITLES } from '@libs/constants';
import { useDocumentTitle } from '@libs/hooks';
import { Box, Button, Paper, Typography, LoginIcon } from '@libs/ui';

import assets from '../../../libs/assets/index';
import { useAuthStore } from '../store/auth.store';

/* ------------------------------------------------------------------ */
/*  Static chart data — hoisted outside component                      */
/* ------------------------------------------------------------------ */

const ACTIVITY_CHART_DATA = [
  { month: 'Jan', value: 10 },
  { month: 'Mar', value: 20 },
  { month: 'May', value: 15 },
  { month: 'Jul', value: 25 },
  { month: 'Sep', value: 30 },
  { month: 'Nov', value: 38 },
] as const;

const DONUT_SEGMENTS = [
  { stroke: 'success.main', dasharray: '132 188', dashoffset: 0 },
  { stroke: 'warning.main', dasharray: '19 188', dashoffset: -132 },
  { stroke: 'info.main', dasharray: '19 188', dashoffset: -151 },
] as const;

const STATUS_LEGEND = [
  { label: 'Active', strokeKey: 'success.main' },
  { label: 'Idle', strokeKey: 'warning.main' },
  { label: 'Maintenance', strokeKey: 'info.main' },
] as const;

/* ------------------------------------------------------------------ */

const LoginPage = () => {
  useDocumentTitle(getPageTitle(PAGE_TITLES.LOGIN));

  const { login } = useAuthStore();

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        flexDirection: { xs: 'column', md: 'row' },
        overflow: 'hidden',
      }}
    >
      {/* Left Side — primary background with dashboard preview */}
      <Box
        sx={{
          flex: 1,
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          p: { xs: 2.5, sm: 2.5, md: 3 },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'auto',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            maxWidth: '600px',
            mx: 'auto',
            width: '100%',
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 1,
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
              lineHeight: 1.2,
            }}
          >
            Welcome back! We&apos;re glad to see you again.
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mb: { xs: 2, md: 2.5 },
              opacity: 0.95,
              fontSize: { xs: '0.9375rem', md: '1rem' },
              lineHeight: 1.5,
            }}
          >
            Log in to manage your EMS Sonic devices with ease.
          </Typography>

          {/* Dashboard Preview Cards */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {/* Device Activity Card */}
            <Paper
              elevation={3}
              sx={{
                backgroundColor: 'common.white',
                p: { xs: 1.5, sm: 2 },
                borderRadius: 2,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: 'text.primary',
                  mb: 1,
                  fontWeight: 600,
                  fontSize: '1rem',
                }}
              >
                Device Activity
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: 1,
                  height: 120,
                }}
              >
                {ACTIVITY_CHART_DATA.map((item) => (
                  <Box
                    key={item.month}
                    sx={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 0.5,
                    }}
                  >
                    <Box
                      sx={{
                        width: '100%',
                        height: `${(item.value / 40) * 95}px`,
                        bgcolor: 'primary.main',
                        borderRadius: '4px 4px 0 0',
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{ color: 'text.secondary', fontSize: '0.75rem' }}
                    >
                      {item.month}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>

            {/* Device Status Card */}
            <Paper
              elevation={3}
              sx={{
                backgroundColor: 'common.white',
                p: { xs: 1.5, sm: 2 },
                borderRadius: 2,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: 'text.primary',
                  mb: 1,
                  fontWeight: 600,
                  fontSize: '1rem',
                }}
              >
                Device Status
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {/* Donut Chart */}
                <Box sx={{ position: 'relative', width: 80, height: 80 }}>
                  <svg width="80" height="80" viewBox="0 0 80 80">
                    {DONUT_SEGMENTS.map((seg, i) => (
                      <circle
                        key={i}
                        cx="40"
                        cy="40"
                        r="30"
                        fill="none"
                        stroke={`var(--mui-palette-${seg.stroke.replace('.', '-')})`}
                        strokeWidth="14"
                        strokeDasharray={seg.dasharray}
                        strokeDashoffset={seg.dashoffset}
                        transform="rotate(-90 40 40)"
                      />
                    ))}
                  </svg>
                </Box>

                {/* Legend */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {STATUS_LEGEND.map((item) => (
                    <Box
                      key={item.label}
                      sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                    >
                      <Box
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          bgcolor: item.strokeKey,
                        }}
                      />
                      <Typography
                        variant="body2"
                        sx={{ color: 'text.primary', fontSize: '0.8125rem' }}
                      >
                        {item.label}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>

      {/* Right Side — light background with login form */}
      <Box
        sx={{
          flex: 1,
          bgcolor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: { xs: 2.5, sm: 2.5, md: 3 },
          overflow: 'auto',
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: '450px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Logo / Brand */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: { xs: 2.5, md: 3 },
            }}
          >
            <RouterLink
              to="/"
              className="flex items-center gap-2"
              style={{ textDecoration: 'none' }}
            >
              <Box
                component="img"
                src={assets.svgs.miniEMSSvg}
                alt="miniEMS Logo"
                className="h-15 w-auto cursor-pointer"
              />
            </RouterLink>
          </Box>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: 'text.primary',
              mb: 0.75,
              textAlign: 'center',
              fontSize: { xs: '1.375rem', sm: '1.5rem', md: '1.75rem' },
            }}
          >
            Hello! Ready to sign in?
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              mb: { xs: 2.5, md: 3 },
              textAlign: 'center',
              fontSize: { xs: '0.875rem', md: '0.9375rem' },
              lineHeight: 1.5,
            }}
          >
            Enter your details below to jump back into your dashboard.
          </Typography>

          {/* SSO Login Button */}
          <Button
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            startIcon={<LoginIcon />}
            sx={{
              py: { xs: 1.3, md: 1.5 },
              fontSize: { xs: '0.875rem', md: '0.9375rem' },
              fontWeight: 600,
              textTransform: 'none',
              mb: { xs: 2, md: 2.5 },
              boxShadow: 2,
              '&:hover': {
                boxShadow: 3,
              },
            }}
            onClick={() => login()}
          >
            Login with SSO
          </Button>

          {/* Footer Links */}
          <Box
            sx={{
              width: '100%',
              mt: 'auto',
              pt: { xs: 1.5, md: 2 },
              display: 'flex',
              justifyContent: 'center',
              gap: 2,
              flexWrap: 'wrap',
            }}
          >
            <Typography
              component="a"
              href="#"
              variant="body2"
              sx={{
                color: 'text.secondary',
                textDecoration: 'none',
                fontSize: '0.875rem',
                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              Terms of Service
            </Typography>
            <Typography
              component="a"
              href="#"
              variant="body2"
              sx={{
                color: 'text.secondary',
                textDecoration: 'none',
                fontSize: '0.875rem',
                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              Privacy Policy
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;
