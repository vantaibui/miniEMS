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

  const deviceInfo = device?.device ?? null;
  const deviceStatus = deviceInfo?.status ?? null;

  const statusDisplay = String(
    deviceStatus?.display ?? deviceStatus?.value ?? fallback,
  );
  const statusValue = deviceStatus?.value;
  const isActive = statusValue === 'IN_SERVICE';

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
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                flexWrap: 'wrap',
              }}
            >
              <Typography
                variant="h3"
                sx={{ fontWeight: 800, color: '#0F172A' }}
              >
                {deviceInfo?.name ?? fallback}
              </Typography>
              <Chip
                label={statusDisplay}
                sx={{
                  height: 28,
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: 0.8,
                  px: 1.5,
                  borderRadius: 999,
                  bgcolor: isActive ? '#D1FAE5' : '#FEE2E2',
                  color: isActive ? '#047857' : '#B91C1C',
                }}
              />
            </Box>
            <Typography
              variant="body1"
              sx={{
                mt: 1,
                color: '#64748B',
                display: 'flex',
                alignItems: 'center',
                gap: 0.75,
              }}
            >
              <DesktopWindowsIcon sx={{ fontSize: 16 }} />
              {deviceInfo?.deviceType?.display ?? fallback} •{' '}
              {deviceInfo?.model ?? fallback}
            </Typography>
          </Box>
        </Box>
      ) : null}

      <Grid container spacing={2.5}>
        <SpecItem label="Serial Number" value={deviceInfo?.serialNumber} />
        <SpecItem label="IP Address" value={deviceInfo?.managementIp} />
        <SpecItem label="MAC Address" value={deviceInfo?.macAddress} />
        <SpecItem label="Model" value={deviceInfo?.model} />
        <SpecItem label="Device Type" value={deviceInfo?.deviceType?.display} />
        <SpecItem label="OS Type" value={deviceInfo?.osType?.display} />
        <SpecItem
          label="OS Version"
          value={deviceInfo?.osVersion}
          gridSize={{ xs: 12 }}
        />
      </Grid>

      <Grid
        container
        spacing={2.5}
        sx={{ borderTop: '1px solid', borderColor: '#E2E8F0', pt: 3 }}
      >
        <SpecItem label="Distribution" value={deviceInfo?.distribution} />
        <SpecItem label="Kernel" value={deviceInfo?.kernel} />
        <SpecItem label="Build Commit" value={deviceInfo?.buildCommit} />
        <SpecItem label="Built By" value={deviceInfo?.builtBy} />
        <SpecItem label="Platform" value={deviceInfo?.platform} />
        <SpecItem label="HW SKU" value={deviceInfo?.hwSku} />
        <SpecItem
          label="Hardware Revision"
          value={deviceInfo?.hardwareRevision}
        />
        <SpecItem
          label="Build Date"
          value={deviceInfo?.buildDate}
          gridSize={{ xs: 12 }}
        />
        <SpecItem label="ASIC Type" value={deviceInfo?.asicType} />
        <SpecItem label="ASIC Count" value={deviceInfo?.asicCount} />
        <SpecItem
          label="Uptime (s)"
          value={deviceInfo?.uptime}
          gridSize={{ xs: 12 }}
        />
      </Grid>
    </Box>
  );

  if (compact) {
    return content;
  }

  return <Card sx={{ p: 3, borderRadius: 3 }}>{content}</Card>;
};
