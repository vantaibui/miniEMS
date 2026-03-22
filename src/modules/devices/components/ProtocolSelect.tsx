import { useCallback, useEffect, useMemo } from 'react';

import { Box, CircularProgress, MenuItem, Select } from '@mui/material';
import { useInfiniteQuery } from '@tanstack/react-query';

import { queryKeys } from '@libs/query';
import { UiFormField } from '@libs/ui';

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

  // Build Map once per data change — avoids O(n) lookups on every render
  const protocolMap = useMemo(() => {
    const map = new Map<number, string>();
    data?.pages.forEach((page) => {
      page.data.forEach(({ id, name }) => {
        const normalizedId = Number(id);
        if (!Number.isNaN(normalizedId) && name) {
          map.set(normalizedId, name);
        }
      });
    });
    return map;
  }, [data]);

  const protocolOptions = useMemo(
    () => Array.from(protocolMap.entries()).map(([id, label]) => ({ id, label })),
    [protocolMap],
  );

  // Derive display label via memo instead of useEffect
  const displayLabel = useMemo(() => {
    if (!value) return;
    return protocolOptions.find((opt) => opt.id === value)?.label;
  }, [value, protocolOptions]);

  useEffect(() => {
    if (displayLabel && onDisplayChange) {
      onDisplayChange(displayLabel);
    }
  }, [displayLabel, onDisplayChange]);

  const handleChange = useCallback(
    (event: unknown) => {
      const selectedId = Number(
        (event as { target: { value: string | number } }).target.value,
      );
      onChange(selectedId);
      onResetTestStatus?.();

      const selectedOption = protocolOptions.find((opt) => opt.id === selectedId);
      if (selectedOption?.label) {
        onDisplayChange?.(selectedOption.label);
      }
    },
    [onChange, onResetTestStatus, onDisplayChange, protocolOptions],
  );

  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLUListElement>) => {
      const target = event.currentTarget;
      const reachedBottom =
        target.scrollTop + target.clientHeight >= target.scrollHeight - 12;

      if (reachedBottom && hasNextPage && !isFetchingNextPage) {
        void fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage],
  );

  const renderValue = (selected: unknown) => {
    if (!selected) {
      return <Box sx={{ color: 'text.disabled' }}>Select protocol</Box>;
    }

    const selectedOption = protocolOptions.find((opt) => opt.id === selected);
    return selectedOption?.label ?? 'Unknown protocol';
  };

  return (
    <UiFormField label="PROTOCOL" required={required} errorText={errorText}>
      <Select
        value={value === '' ? '' : Number(value)}
        onChange={handleChange}
        fullWidth
        disabled={disabled}
        displayEmpty
        renderValue={renderValue}
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
              {opt.label}
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
