import { queryKeys } from '@libs/query';
import { UiFormField } from '@libs/ui';
import { Box, CircularProgress, MenuItem, Select } from '@mui/material';
import { useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';

import { devicesApi } from '../api';

interface ProtocolSelectProps {
  value: number | '';
  onChange: (value: number) => void;
  errorText?: string;
  disabled?: boolean;
  required?: boolean;
  onResetTestStatus?: () => void;
  onDisplayChange?: (display: string) => void;
}

const PAGE_SIZE = 10;

export const ProtocolSelect = ({
  value,
  onChange,
  errorText,
  disabled,
  required = true,
  onResetTestStatus,
  onDisplayChange,
}: ProtocolSelectProps) => {
  const { data, isFetching, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: [...queryKeys.device.protocolLists(), { size: PAGE_SIZE }],
      queryFn: async ({ pageParam }) => {
        return await devicesApi.getProtocols({
          page: pageParam,
          size: PAGE_SIZE,
        });
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage) => {
        const pagination = lastPage.meta?.pagination;
        if (!pagination) return undefined;

        const nextPage = pagination.page + 1;
        return nextPage < pagination.totalPages ? nextPage : undefined;
      },
    });

  const protocolMap = new Map<number, string>();

  data?.pages.forEach((page) => {
    page.data.forEach((item) => {
      if (item.id != null && item.display) {
        protocolMap.set(item.id, item.display);
      }
    });
  });

  const protocolOptions = Array.from(protocolMap.entries()).map(
    ([id, display]) => ({ id, display }),
  );

  useEffect(() => {
    if (!value || !onDisplayChange) return;
    const selectedOption = protocolOptions.find((opt) => opt.id === value);
    if (selectedOption?.display) {
      onDisplayChange(selectedOption.display);
    }
  }, [value, protocolOptions, onDisplayChange]);

  const handleScroll = (event: React.UIEvent<HTMLUListElement>) => {
    const target = event.currentTarget;
    const reachedBottom =
      target.scrollTop + target.clientHeight >= target.scrollHeight - 12;

    if (reachedBottom && hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  };

  return (
    <UiFormField
      label="PROTOCOL"
      required={required}
      errorText={errorText}
    >
      <Select
        value={value}
        onChange={(event) => {
          const selectedId = Number(event.target.value);
          onChange(selectedId);
          onResetTestStatus?.();
          const selectedOption = protocolOptions.find((opt) => opt.id === selectedId);
          if (selectedOption?.display) {
            onDisplayChange?.(selectedOption.display);
          }
        }}
        fullWidth
        disabled={disabled}
        displayEmpty
        renderValue={(selected) => {
          if (!selected) {
            return <Box sx={{ color: 'text.disabled' }}>Select protocol</Box>;
          }

          const selectedOption = protocolOptions.find((opt) => opt.id === selected);
          return selectedOption?.display ?? selected;
        }}
        MenuProps={{
          PaperProps: {
            sx: { maxHeight: 320 },
          },
          MenuListProps: {
            onScroll: handleScroll,
          },
        }}
      >
        {protocolOptions.length === 0 ? (
          <MenuItem
            value=""
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
            }}
          >
            {isFetching ? 'Loading protocols...' : 'No protocols'}
          </MenuItem>
        ) : (
          protocolOptions.map((opt) => (
            <MenuItem key={opt.id} value={opt.id}>
              {opt.display}
            </MenuItem>
          ))
        )}

        {isFetchingNextPage ? (
          <MenuItem disabled>
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                py: 0.5,
              }}
            >
              <CircularProgress size={18} />
            </Box>
          </MenuItem>
        ) : null}
      </Select>
    </UiFormField>
  );
};
