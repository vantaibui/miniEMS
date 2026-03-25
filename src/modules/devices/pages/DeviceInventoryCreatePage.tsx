import { useNavigate } from 'react-router-dom';

import { PageLayout } from '@app/layout';

import { DeviceForm } from '../components/DeviceForm';
import { useDeviceCreate } from '../hooks';

export const DeviceInventoryCreatePage = () => {
  const navigate = useNavigate();

  const { mutate: createDevice, isPending: isCreating } = useDeviceCreate();

  const handleSubmit = (data: FormData) => {
    createDevice(data, {
      onSuccess: () => navigate('/devices'),
    });
  };

  return (
    <PageLayout title="Add Device">
      <DeviceForm
        onSubmit={handleSubmit}
        onCancel={() => navigate('/devices')}
        isLoading={isCreating}
        submitLabel="Add Device"
      />
    </PageLayout>
  );
};
