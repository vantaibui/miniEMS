import { useNavigate } from 'react-router-dom';

import { PageLayout } from '@/components/layout';

import { DeviceForm } from '../components/DeviceForm';
import { useDeviceCreate } from '../hooks';

export const DeviceInventoryCreatePage = () => {
  const navigate = useNavigate();

  const { mutate: createDevice, isPending: isCreating } = useDeviceCreate();

  const handleSubmit = (data: FormData) => {
    createDevice(data, {
      onSuccess: () => navigate('/device-inventory'),
    });
  };

  return (
    <PageLayout
      title="Add Device"
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Device Management', href: '/device-inventory' },
        { label: 'Add Device' },
      ]}
    >
      <DeviceForm
        onSubmit={handleSubmit}
        onCancel={() => navigate('/device-inventory')}
        isLoading={isCreating}
        submitLabel="Add Device"
      />
    </PageLayout>
  );
};
