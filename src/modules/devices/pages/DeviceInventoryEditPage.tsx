import { useMemo } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useToast } from '@libs/hooks';

import { PageLayout } from '@/components/layout';

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
    <PageLayout
      title="Edit Device"
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Device Management', href: '/device-inventory' },
        { label: 'Edit Device' },
      ]}
    >
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
    </PageLayout>
  );
};
