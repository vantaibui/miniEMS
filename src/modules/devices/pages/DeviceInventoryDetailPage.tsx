import { useMemo } from 'react';

import { useParams } from 'react-router-dom';

import { PageLayout } from '@app/layout';

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
    <PageLayout title="Device Detail">
      <DeviceDetailsContent
        device={device}
        isLoading={isLoading}
        showDeviceHeading
      />
    </PageLayout>
  );
};
