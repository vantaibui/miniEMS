import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@libs/query';

import { rolesApi } from '../api';
import type { CreateRolePayload, RoleDetailEntity } from '../types';

export const useRoleCreate = () => {
  const queryClient = useQueryClient();

  return useMutation<RoleDetailEntity, Error, CreateRolePayload>({
    mutationFn: (payload) => rolesApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roles.lists() });
    },
  });
};
