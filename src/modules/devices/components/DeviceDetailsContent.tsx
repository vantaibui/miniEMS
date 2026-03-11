// cspell:ignore asic hwsku sonic
import DesktopWindowsIcon from '@mui/icons-material/DesktopWindows';
import DownloadIcon from '@mui/icons-material/Download';
import { Box, Card, Chip, Grid, Typography } from '@mui/material';

import { UiButton } from '@libs/ui';

import type { DeviceDetail } from '../types';

const fallback = 'N/A';

interface DeviceDetailsContentProps {
  device?: DeviceDetail;
  isLoading?: boolean;
  compact?: boolean;
  showDeviceHeading?: boolean;
}

const SpecItem = ({
  label,
  value,
  gridSize = { xs: 12, md: 6 },
}: {
  label: string;
  value?: string | number | null;
  gridSize?: { xs: number; md?: number };
}) => (
  <Grid size={gridSize}>
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
      <Typography
        variant="caption"
        sx={{
          color: '#94A3B8',
          textTransform: 'uppercase',
          letterSpacing: 1,
          fontWeight: 600,
        }}
      >
        {label}
      </Typography>
      <Typography variant="body1" sx={{ fontWeight: 600, color: '#334155' }}>
        {value ?? fallback}
      </Typography>
    </Box>
  </Grid>
);

export const DeviceDetailsContent = ({
  device,
  isLoading,
  compact = false,
  showDeviceHeading = false,
}: DeviceDetailsContentProps) => {
  if (isLoading) {
    return (
      <Typography variant="body2" color="text.secondary">
        Loading device details...
      </Typography>
    );
  }

  if (!device) {
    return (
      <Typography variant="body2" color="text.secondary">
        Device not found.
      </Typography>
    );
  }

  const content = (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {showDeviceHeading ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: { xs: 'flex-start', md: 'center' },
            justifyContent: 'space-between',
            gap: 2,
            flexWrap: 'wrap',
          }}
        >
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
              <Typography variant="h3" sx={{ fontWeight: 800, color: '#0F172A' }}>
                {device.name ?? fallback}
              </Typography>
              <Chip
                label={(device.status ?? 'Unknown').toUpperCase()}
                sx={{
                  height: 28,
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: 0.8,
                  px: 1.5,
                  borderRadius: 999,
                  bgcolor: device.status === 'Active' ? '#B8EBD2' : '#E2E8F0',
                  color: device.status === 'Active' ? '#047857' : '#475467',
                }}
              />
            </Box>
            <Typography
              variant="body1"
              sx={{ mt: 1, color: '#64748B', display: 'flex', alignItems: 'center', gap: 0.75 }}
            >
              <DesktopWindowsIcon sx={{ fontSize: 16 }} />
              Workstation • {device.model ?? fallback}
            </Typography>
          </Box>

          <UiButton
            variant="secondary"
            startIcon={<DownloadIcon fontSize="small" />}
          >
            Download Logs
          </UiButton>
        </Box>
      ) : null}

      <Grid container spacing={2.5}>
        <SpecItem label="Serial Number" value={device.serialNumber} />
        <SpecItem label="IP Address" value={device.ip} />
        <SpecItem label="Model" value={device.model} />
        <SpecItem label="SONiC Software Version" value={device.soNicSoftwareVersion} gridSize={{ xs: 12 }} />
      </Grid>

      <Grid container spacing={2.5} sx={{ borderTop: '1px solid', borderColor: '#E2E8F0', pt: 3 }}>
        <SpecItem label="Distribution" value={device.distribution} />
        <SpecItem label="Kernel" value={device.kernel} />
        <SpecItem label="Build Commit" value={device.buildCommit} />
        <SpecItem label="Platform" value={device.platform} />
        <SpecItem label="Build Date" value={device.buildDate} gridSize={{ xs: 12 }} />
        <SpecItem label="HW SKU" value={device.hwSKU} />
        <SpecItem label="ASIC" value={device.asic} />
        <SpecItem label="Uptime" value={device.uptime} gridSize={{ xs: 12 }} />
      </Grid>
    </Box>
  );

  if (compact) {
    return content;
  }

  return <Card sx={{ p: 3, borderRadius: 3 }}>{content}</Card>;
};
