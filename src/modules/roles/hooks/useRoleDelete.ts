import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@libs/query';

import { rolesApi } from '../api';

export const useRoleDelete = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number | string>({
    mutationFn: (id) => rolesApi.delete(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roles.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.roles.details() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.roles.permissions(id),
      });
    },
  });
};
