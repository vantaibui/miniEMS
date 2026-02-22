import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@libs/query';

import { usersApi } from '../api';

export const useUserDelete = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number | string>({
    mutationFn: (id) => usersApi.delete(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(id) });
    },
  });
};
