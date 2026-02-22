import {
  Box,
  Typography,
  Container,
  Stack,
  Button,
  DashboardIcon,
  HeadsetMicIcon,
} from '@libs/ui';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default',
        position: 'relative',
        overflow: 'hidden',
        p: 2,
      }}
    >
      <Box
        sx={{
          mb: { xs: 8, md: 12 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '8rem', sm: '12rem', md: '16rem' },
            fontWeight: 800,
            color: 'action.disabledBackground',
            opacity: 0.5,
            lineHeight: 1,
            mb: -8,
            zIndex: 0,
            userSelect: 'none',
          }}
        >
          404
        </Typography>

        <Container
          maxWidth="sm"
          sx={{
            position: 'relative',
            zIndex: 1,
            textAlign: 'center',
            mt: { xs: 4, md: 6 },
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 700,
              mb: 2,
              color: 'text.primary',
              position: 'relative',
              display: 'inline-block',
              '&::after': {
                content: '""',
                display: 'block',
                width: '100%',
                height: '4px',
                bgcolor: 'primary.main',
                mt: 0.5,
                borderRadius: 1,
              },
            }}
          >
            Page Not Found
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 4, mt: 2, px: { xs: 2, md: 0 } }}
          >
            The page you are looking for might have been removed, had its name
            changed, or is temporarily unavailable.
          </Typography>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            <Button
              variant="contained"
              startIcon={<DashboardIcon />}
              onClick={() => navigate('/')}
            >
              Back to Dashboard
            </Button>

            <Button
              variant="outlined"
              startIcon={<HeadsetMicIcon />}
              onClick={() =>
                (window.location.href = 'mailto:support@sonicvista.com')
              }
            >
              Contact Support
            </Button>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default NotFoundPage;
