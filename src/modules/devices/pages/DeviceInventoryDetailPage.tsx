import { UiBreadcrumb } from '@libs/ui';
import { Box, Typography } from '@mui/material';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { DeviceDetailsContent } from '../components/DeviceDetailsContent';
import { useDeviceDetail } from '../hooks';

export const DeviceInventoryDetailPage = () => {
  const { id } = useParams();

  const parsedId = useMemo(() => {
    if (!id) return undefined;

    const numberId = Number(id);
    return Number.isNaN(numberId) ? id : numberId;
  }, [id]);

  const { data: device, isLoading } = useDeviceDetail(parsedId);

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <UiBreadcrumb
          items={[
            { label: 'Dashboard', href: '/' },
            { label: 'Asset Management', href: '#' },
            { label: 'Device Inventory', href: '/device-inventory' },
            { label: 'Device Detail' },
          ]}
        />

        <Typography
          variant="h4"
          sx={{ fontWeight: 700, color: 'text.primary', mt: 2 }}
        >
          Device Detail
        </Typography>
      </Box>

      <DeviceDetailsContent device={device} isLoading={isLoading} />
    </Box>
  );
};
