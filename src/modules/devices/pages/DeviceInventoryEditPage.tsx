import { useMemo, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { PageLayout } from '@app/layout';

import { useToast } from '@libs/hooks';
import { UiButton } from '@libs/ui';


import { DeviceForm } from '../components/DeviceForm';
import { useDeviceDetail, useDeviceUpdate } from '../hooks';

export const DeviceInventoryEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const formId = 'device-edit-form';
  const [formState, setFormState] = useState({ isDirty: false, isValid: false });

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
        onSuccess: () => navigate('/devices'),
      },
    );
  };

  return (
    <PageLayout
      title="Edit Device"
      actions={
        <>
          <UiButton
            type="button"
            variant="outlined"
            onClick={() => navigate('/devices')}
            disabled={isUpdating || isLoadingDetail}
          >
            Cancel
          </UiButton>
          <UiButton
            type="submit"
            variant="contained"
            form={formId}
            loading={isUpdating}
            disabled={
              isUpdating ||
              isLoadingDetail ||
              !formState.isDirty ||
              !formState.isValid
            }
          >
            Save Changes
          </UiButton>
        </>
      }
    >
      <DeviceForm
        formId={formId}
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
        isLoading={isUpdating || isLoadingDetail}
        submitLabel="Save Changes"
        showFooterActions={false}
        onFormStateChange={setFormState}
      />
    </PageLayout>
  );
};
