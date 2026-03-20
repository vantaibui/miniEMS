import { useMemo } from 'react';

import { Box, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

import { useToast } from '@libs/hooks';
import { UiBreadcrumb } from '@libs/ui';

import { DeviceForm } from '../components/DeviceForm';
import { useDeviceDetail, useDeviceUpdate } from '../hooks';

export const DeviceInventoryEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const parsedId = useMemo(() => {
    if (!id) return undefined;

    const numberId = Number(id);
    return Number.isNaN(numberId) ? id : numberId;
  }, [id]);

  const { data: device, isLoading: isLoadingDetail } =
    useDeviceDetail(parsedId);
  const { mutate: updateDevice, isPending: isUpdating } = useDeviceUpdate();

  const handleSubmit = (data: FormData) => {
    if (parsedId === undefined) {
      toast.error('Device id is required');
      return;
    }

    updateDevice(
      {
        id: parsedId,
        payload: data,
      },
      {
        onSuccess: () => navigate('/device-inventory'),
      },
    );
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
              { label: 'Edit Device' },
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
          Edit Device
        </Typography>

        <Typography variant="body1" sx={{ color: 'text.secondary', mt: 2 }}>
          Update management connection and authentication settings for this
          device.
        </Typography>
      </Box>

      <Box sx={{ mt: 4 }}>
        <DeviceForm
          initialValues={{
            managementIp: device?.device?.managementIp ?? '',
            port: device?.connection?.port ?? 8080,
            protocolId: device?.protocol?.id ?? 6,
            authenticationType:
              device?.credential?.authenticationType ?? 'USERNAME_PASSWORD',
            username: device?.credential?.username ?? '',
            password: device?.credential?.password ?? '',
            clientCertificate: device?.credential?.clientCertificate ?? '',
          }}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/device-inventory')}
          isLoading={isUpdating || isLoadingDetail}
          submitLabel="Save Changes"
        />
      </Box>
    </Box>
  );
};
