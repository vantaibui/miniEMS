import { useQueryClient } from '@tanstack/react-query';

import { queryKeys, useAppMutation } from '@libs/query';
import {
  resolveSuccessMessage,
  type ApiSuccessResponse,
} from '@services/http';
import { useToast } from '@libs/hooks';

import { devicesApi } from '../api';
import type {
  Device,
  DeviceTestConnectionResult,
} from '../types';

export interface UpdateDeviceVariables {
  id: number | string;
  payload: FormData;
}

export const useDeviceCreate = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useAppMutation<ApiSuccessResponse<Device>, FormData>({
    mutationFn: (payload: FormData) => devicesApi.create(payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.device.lists() });
      toast.success(resolveSuccessMessage(res.message, 'create'));
    },
  });
};

export const useDeviceUpdate = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useAppMutation<ApiSuccessResponse<Device>, UpdateDeviceVariables>({
    mutationFn: ({ id, payload }) => devicesApi.update(id, payload),
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.device.lists() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.device.detail(variables.id),
      });
      toast.success(resolveSuccessMessage(res.message, 'update'));
    },
  });
};

export const useDeviceDelete = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useAppMutation<ApiSuccessResponse<void>, number | string>({
    mutationFn: (id) => devicesApi.delete(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.device.lists() });
      toast.success(resolveSuccessMessage(res.message, 'delete'));
    },
  });
};

export const useDeviceTestConnection = () => {
  return useAppMutation<
    ApiSuccessResponse<DeviceTestConnectionResult>,
    FormData
  >({
    mutationFn: (payload) => devicesApi.testConnection(payload),
  });
};
