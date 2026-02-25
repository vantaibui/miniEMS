import assets from '../../../libs/assets/index';
import { Box, Button, Paper, Typography, LoginIcon } from '@libs/ui';
import { getPageTitle, PAGE_TITLES } from '@libs/constants';
import { useDocumentTitle } from '@libs/hooks';
import { useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';

const LoginPage = () => {
  useDocumentTitle(getPageTitle(PAGE_TITLES.LOGIN));

  const { login, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        flexDirection: { xs: 'column', md: 'row' },
        overflow: 'hidden',
      }}
    >
      {/* Left Side - Blue Background with Dashboard Preview */}
      <Box
        sx={{
          flex: 1,
          backgroundColor: '#0B5394',
          color: 'white',
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
            Welcome back! We're glad to see you again.
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
                backgroundColor: 'white',
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
                {[
                  { month: 'Jan', value: 10 },
                  { month: 'Mar', value: 20 },
                  { month: 'May', value: 15 },
                  { month: 'Jul', value: 25 },
                  { month: 'Sep', value: 30 },
                  { month: 'Nov', value: 38 },
                ].map((item, index) => (
                  <Box
                    key={index}
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
                        backgroundColor: '#0B5394',
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
                backgroundColor: 'white',
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
                    <circle
                      cx="40"
                      cy="40"
                      r="30"
                      fill="none"
                      stroke="#0B5394"
                      strokeWidth="14"
                      strokeDasharray="132 188"
                      transform="rotate(-90 40 40)"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="30"
                      fill="none"
                      stroke="#F9C74F"
                      strokeWidth="14"
                      strokeDasharray="19 188"
                      strokeDashoffset="-132"
                      transform="rotate(-90 40 40)"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="30"
                      fill="none"
                      stroke="#90CCF4"
                      strokeWidth="14"
                      strokeDasharray="19 188"
                      strokeDashoffset="-151"
                      transform="rotate(-90 40 40)"
                    />
                  </svg>
                </Box>
                {/* Legend */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        backgroundColor: '#0B5394',
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{ color: 'text.primary', fontSize: '0.8125rem' }}
                    >
                      Active
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        backgroundColor: '#F9C74F',
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{ color: 'text.primary', fontSize: '0.8125rem' }}
                    >
                      Idle
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        backgroundColor: '#90CCF4',
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{ color: 'text.primary', fontSize: '0.8125rem' }}
                    >
                      Maintenance
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>

      {/* Right Side - Light Background with Login */}
      <Box
        sx={{
          flex: 1,
          backgroundColor: '#F5F5F5',
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
          {/* Logo/Brand with Icon */}
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
              style={{ textDecoration: 'none', display: 'flex' }}
            >
              <img
                src={assets.svgs.miniEMSSvg}
                alt="miniEMS Logo"
                style={{ height: '60px', width: 'auto', cursor: 'pointer' }}
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
                  color: '#0B5394',
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
                  color: '#0B5394',
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
