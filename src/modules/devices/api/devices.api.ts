import { createResourceApi, http, type ApiSuccessResponse } from '@services/http';

import { DEVICES_ENDPOINTS } from './devices.endpoints';

import type {
  CreateDevicePayload,
  Device,
  DeviceDetail,
  DeviceTestConnectionResult,
  UpdateDevicePayload,
} from '../types';

const crud = createResourceApi<Device, CreateDevicePayload, UpdateDevicePayload>({
  base: DEVICES_ENDPOINTS.LIST,
});

export interface DevicesListParams {
  page?: number;
  size?: number;
  [key: string]: unknown;
}

export interface Protocol {
  id: number;
  display: string;
}

export interface ProtocolsListParams {
  page?: number;
  size?: number;
  [key: string]: unknown;
}

export const devicesApi = {
  async getList(
    params?: DevicesListParams,
  ): Promise<ApiSuccessResponse<Array<Device>>> {
    return await crud.getList(params as Record<string, unknown>);
  },

  async getProtocols(
    params?: ProtocolsListParams,
  ): Promise<ApiSuccessResponse<Array<Protocol>>> {
    return await http.get<Array<Protocol>>(DEVICES_ENDPOINTS.PROTOCOLS, {
      params,
    });
  },

  async getById(id: number | string): Promise<ApiSuccessResponse<DeviceDetail>> {
    return await http.get<DeviceDetail>(DEVICES_ENDPOINTS.DETAIL(id));
  },

  async create(
    payload: CreateDevicePayload,
  ): Promise<ApiSuccessResponse<Device>> {
    return await crud.create(payload);
  },

  async update(
    id: number | string,
    payload: UpdateDevicePayload,
  ): Promise<ApiSuccessResponse<Device>> {
    return await http.put<Device, UpdateDevicePayload>(
      DEVICES_ENDPOINTS.DETAIL(id),
      payload,
    );
  },

  async delete(id: number | string): Promise<ApiSuccessResponse<void>> {
    return await crud.delete(id);
  },

  async testConnection(
    payload: CreateDevicePayload,
  ): Promise<ApiSuccessResponse<DeviceTestConnectionResult>> {
    return await http.post<DeviceTestConnectionResult>(
      DEVICES_ENDPOINTS.TEST_CONNECTION,
      payload,
    );
  },
};
