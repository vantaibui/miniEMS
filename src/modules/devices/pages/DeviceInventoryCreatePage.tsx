import { useToast } from '@libs/hooks';
import { UiBreadcrumb } from '@libs/ui';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { DeviceForm } from '../components/DeviceForm';
import { useDeviceCreate } from '../hooks';
import type { CreateDevicePayload } from '../types';

export const DeviceInventoryCreatePage = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const { mutate: createDevice, isPending: isCreating } = useDeviceCreate();

  const handleSubmit = (data: CreateDevicePayload) => {
    createDevice(data, {
      onSuccess: (res) => {
        toast.success(res.message || 'Device created successfully!');
        navigate('/device-inventory');
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to create device');
      },
    });
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ mb: 2 }}>
          <UiBreadcrumb
            items={[
              { label: 'Dashboard', href: '/' },
              { label: 'Asset Management', href: '#' },
              { label: 'Device Inventory', href: '/device-inventory' },
              { label: 'Add Device' },
            ]}
          />
        </Box>

        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: 'text.primary',
            mb: 1,
            display: 'inline-block',
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -4,
              left: 0,
              width: '40px',
              height: '3px',
              bgcolor: 'primary.main',
              borderRadius: '2px',
            },
          }}
        >
          Add Device
        </Typography>

        <Typography variant="body1" sx={{ color: 'text.secondary', mt: 2 }}>
          Configure management connection and authentication for a new device.
        </Typography>
      </Box>

      <Box sx={{ mt: 4 }}>
        <DeviceForm
          onSubmit={handleSubmit}
          onCancel={() => navigate('/device-inventory')}
          isLoading={isCreating}
          submitLabel="Add Device"
        />
      </Box>
    </Box>
  );
};
