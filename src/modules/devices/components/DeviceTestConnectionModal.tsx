import CloseIcon from '@mui/icons-material/Close';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import {
  Box,
  Divider,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useState } from 'react';

import { UiButton, UiCommonModal } from '@libs/ui';

import { TestConnectionStatus, type TestStatus } from '../constants';

type ConnectionData = {
  name?: string;
  serialNumber?: string;
  ip?: string;
  port?: string;
  protocol?: string;
  authenticationType?: string;
  username?: string;
  certificate?: string;
};

interface DeviceTestConnectionModalProps {
  open: boolean;
  onClose: () => void;
  data: ConnectionData;
  onStart: () => Promise<TestStatus>;
  onStatusChange: (status: TestStatus) => void;
  isStarting?: boolean;
}

const StatusChip = ({ status }: { status: TestStatus }) => {
  const config =
    status === TestConnectionStatus.InService
      ? { label: 'In Service', bg: '#D1FAE5', color: '#047857' }
      : { label: 'Out of Service', bg: '#FEE2E2', color: '#B91C1C' };

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        py: 0.5,
        borderRadius: 999,
        bgcolor: config.bg,
      }}
    >
      <Typography
        variant="body2"
        sx={{ fontWeight: 700, letterSpacing: 0.4, color: config.color }}
      >
        {config.label}
      </Typography>
    </Box>
  );
};

const InfoRow = ({ label, value }: { label: string; value?: string }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
    <Typography variant="body2" sx={{ fontWeight: 600, color: '#344054' }}>
      {label}
    </Typography>
    <Typography variant="body2" sx={{ fontWeight: 600, color: '#101828' }}>
      {value || 'N/A'}
    </Typography>
  </Box>
);

export const DeviceTestConnectionModal = ({
  open,
  onClose,
  data,
  onStart,
  onStatusChange,
  isStarting,
}: DeviceTestConnectionModalProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [status, setStatus] = useState<TestStatus>(TestConnectionStatus.OutOfService);

  const handleStart = async () => {
    const nextStatus = await onStart();
    setStatus(nextStatus);
    onStatusChange(nextStatus);
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <UiCommonModal
      open={open}
      onClose={handleClose}
      size={isMobile ? 'lg' : 'md'}
      fullScreen={isMobile}
      title={
        <Typography
          variant="h4"
          sx={{ fontWeight: 700, textAlign: 'center', width: '100%' }}
        >
          Test connection
        </Typography>
      }
      contentSx={{ p: { xs: 2, md: 3 }, bgcolor: '#FFFFFF' }}
      actionsSx={{
        justifyContent: { xs: 'space-between', md: 'flex-end' },
        px: { xs: 2, md: 3 },
        py: { xs: 1.5, md: 2 },
        gap: 1.5,
      }}
      actions={
        <>
          <UiButton
            variant="secondary"
            startIcon={<CloseIcon fontSize="small" />}
            onClick={handleClose}
          >
            Close
          </UiButton>
          <UiButton
            variant="primary"
            startIcon={<PlayArrowIcon fontSize="small" />}
            onClick={handleStart}
            disabled={isStarting}
            loading={isStarting}
          >
            Start test
          </UiButton>
        </>
      }
    >
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            sx={{
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              p: 2.5,
              bgcolor: '#F8FAFC',
              height: '100%',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
              Connection details
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <InfoRow label="Device name" value={data.name} />
              <InfoRow label="Serial number" value={data.serialNumber} />
              <InfoRow label="Management IP" value={data.ip} />
              <InfoRow label="Port" value={data.port} />
              <InfoRow label="Protocol" value={data.protocol} />
              <InfoRow label="Authentication" value={data.authenticationType} />
              {data.username ? <InfoRow label="Username" value={data.username} /> : null}
              {data.certificate ? (
                <InfoRow label="Certificate" value={data.certificate} />
              ) : null}
            </Box>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            sx={{
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              p: 2.5,
              bgcolor: '#FFFFFF',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Test result
            </Typography>
            <StatusChip status={status} />
            <Typography variant="body2" color="text.secondary">
              This test checks the single connection based on the information entered in the
              device form.
            </Typography>
            <Box
              sx={{
                mt: 'auto',
                p: 2,
                borderRadius: 2,
                bgcolor: '#F8FAFC',
                border: '1px dashed',
                borderColor: 'divider',
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#344054' }}>
                Tip
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Update the device information before running the test for the latest results.
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </UiCommonModal>
  );
};
