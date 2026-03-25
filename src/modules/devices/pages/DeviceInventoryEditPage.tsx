import { useMemo } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { PageLayout } from '@app/layout';

import { useToast } from '@libs/hooks';

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

  const connections =
    device?.connections
      ?.map((item) => ('connection' in item ? item.connection : item))
      ?.filter(Boolean) ?? [];

  const primaryConnection =
    device?.connections?.[0]?.connection ?? device?.connection ?? null;
  const primaryProtocol =
    device?.connections?.[0]?.connection?.protocol ?? device?.protocol ?? null;
  const primaryCredential =
    device?.connections?.[0]?.connection?.credential ??
    device?.credential ??
    null;

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
    <PageLayout title="Edit Device">
      <DeviceForm
        initialValues={{
          managementIp: device?.device?.managementIp ?? '',
          connections:
            connections.length > 0
              ? connections.map((connection) => ({
                  connectionId: connection?.id ?? null,
                  functionType: connection?.functionType?.value ?? 'CM',
                  port: connection?.port ?? 8080,
                  protocolId: connection?.protocol?.id ?? 6,
                  authenticationType:
                    connection?.credential?.authenticationType ??
                    'USERNAME_PASSWORD',
                  username: connection?.credential?.username ?? '',
                  password: connection?.credential?.password ?? '',
                  // Backend returns filename; keep it to satisfy validation,
                  // actual upload will be sent only when user re-uploads a file.
                  clientCertificate:
                    connection?.credential?.clientCertificate ?? '',
                }))
              : [
                  {
                    connectionId:
                      // older API shape fallback
                      (primaryConnection as { id?: number | string | null } | null)
                        ?.id ?? null,
                    functionType: 'CM',
                    port: primaryConnection?.port ?? 8080,
                    protocolId: primaryProtocol?.id ?? 6,
                    authenticationType:
                      primaryCredential?.authenticationType ??
                      'USERNAME_PASSWORD',
                    username: primaryCredential?.username ?? '',
                    password: primaryCredential?.password ?? '',
                    clientCertificate: primaryCredential?.clientCertificate ?? '',
                  },
                ],
        }}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/devices')}
        isLoading={isUpdating || isLoadingDetail}
        submitLabel="Save Changes"
      />
    </PageLayout>
  );
};
