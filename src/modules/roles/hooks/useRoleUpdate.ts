import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@libs/query';

import { rolesApi } from '../api';
import type { RoleDetailEntity, UpdateRolePayload } from '../types';

export interface UpdateRoleVariables {
  id: number | string;
  payload: UpdateRolePayload;
}

export const useRoleUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation<RoleDetailEntity, Error, UpdateRoleVariables>({
    mutationFn: ({ id, payload }) => rolesApi.update(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roles.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.roles.details() });
      // permissions may change as part of role update
      queryClient.invalidateQueries({
        queryKey: queryKeys.roles.permissions(variables.id),
      });
    },
  });
};
