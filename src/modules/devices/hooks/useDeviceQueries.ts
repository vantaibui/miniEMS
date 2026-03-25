import { queryKeys, useAppQuery } from '@libs/query';

import type { ApiSuccessResponse, PaginationResult } from '@services/http';

import {
  devicesApi,
  type DevicesListParams,
  type ProtocolsListParams,
} from '../api';

import type { Device, DeviceDetail, Protocol } from '../types';

export type ListResult<T> = {
  items: Array<T>;
  pagination?: PaginationResult;
};

export const useDevices = (params: DevicesListParams = {}) => {
  return useAppQuery<ApiSuccessResponse<Array<Device>>, ListResult<Device>>({
    queryKey: queryKeys.device.list(params),
    queryFn: () => devicesApi.getList(params),
    select: (response) => ({
      items: response?.data ?? [],
      pagination: response?.meta?.pagination,
    }),
  });
};

export const useProtocols = (params: ProtocolsListParams = {}) => {
  return useAppQuery<ApiSuccessResponse<Array<Protocol>>, ListResult<Protocol>>(
    {
      queryKey: queryKeys.device.protocolList(params),
      queryFn: () => devicesApi.getProtocols(params),
      select: (response) => ({
        items: response?.data ?? [],
        pagination: response?.meta?.pagination,
      }),
    },
  );
};

export const useDeviceDetail = (id: number | string | undefined) => {
  return useAppQuery<ApiSuccessResponse<DeviceDetail>, DeviceDetail>({
    queryKey: queryKeys.device.detail(id ?? ''),
    queryFn: () => {
      if (id === undefined || id === null) {
        throw new Error('Device id is required');
      }

      return devicesApi.getById(id);
    },
    select: (response) => response.data,
    enabled: id !== undefined && id !== null,
  });
};
