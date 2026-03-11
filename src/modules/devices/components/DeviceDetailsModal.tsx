import { Typography } from '@mui/material';

import { UiCommonModal } from '@libs/ui';

import { useDeviceDetail } from '../hooks';
import { DeviceDetailsContent } from './DeviceDetailsContent';

interface DeviceDetailsModalProps {
  open: boolean;
  deviceId?: number;
  onClose: () => void;
}

export const DeviceDetailsModal = ({
  open,
  deviceId,
  onClose,
}: DeviceDetailsModalProps) => {
  const { data: device, isLoading } = useDeviceDetail(deviceId);

  return (
    <UiCommonModal
      open={open}
      onClose={onClose}
      size="xl"
      title={
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#101828' }}>
          Device Detail
        </Typography>
      }
      subtitle="Dashboard > Device Inventory > Device Detail"
      contentSx={{ p: { xs: 2, md: 3 }, bgcolor: '#FFFFFF' }}
    >
      <DeviceDetailsContent
        device={device}
        isLoading={isLoading}
        compact
        showDeviceHeading
      />
    </UiCommonModal>
  );
};
