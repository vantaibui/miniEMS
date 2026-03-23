import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { PageLayout } from '@app/layout';

import { UiButton } from '@libs/ui';

import { DeviceForm } from '../components/DeviceForm';
import { useDeviceCreate } from '../hooks';

export const DeviceInventoryCreatePage = () => {
  const navigate = useNavigate();
  const formId = 'device-create-form';
  const [formState, setFormState] = useState({ isDirty: false, isValid: false });

  const { mutate: createDevice, isPending: isCreating } = useDeviceCreate();

  const handleSubmit = (data: FormData) => {
    createDevice(data, {
      onSuccess: () => navigate('/devices'),
    });
  };

  return (
    <PageLayout
      title="Add Device"
      actions={
        <>
          <UiButton
            type="button"
            variant="outlined"
            onClick={() => navigate('/devices')}
            disabled={isCreating}
          >
            Cancel
          </UiButton>
          <UiButton
            type="submit"
            variant="contained"
            form={formId}
            loading={isCreating}
            disabled={isCreating || !formState.isDirty || !formState.isValid}
          >
            Add Device
          </UiButton>
        </>
      }
    >
      <DeviceForm
        formId={formId}
        onSubmit={handleSubmit}
        isLoading={isCreating}
        submitLabel="Add Device"
        showFooterActions={false}
        onFormStateChange={setFormState}
      />
    </PageLayout>
  );
};
