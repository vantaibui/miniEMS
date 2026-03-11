import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import { Box } from '@mui/material';
import { UiSearchInput } from '../search-input';
import { UiSelect } from '../select';
import { UiToolbar } from '../toolbar';
import { cn } from '../utils/cn';
import type { UiTableFiltersProps } from './UiTableFilters.types';

export function UiTableFilters({
  searchValue,
  onSearchChange,
  onSearchClear,
  searchPlaceholder,
  selectValue,
  onSelectChange,
  selectOptions,
  selectPlaceholder,
  selectLabel,
  tabs,
  tabValue,
  onTabChange,
  className,
  right,
}: UiTableFiltersProps) {
  const hasTabs = Boolean(tabs && tabs.length > 0);
  const hasSearch = Boolean(onSearchChange);
  const hasSelect = Boolean(
    onSelectChange && selectOptions && selectOptions.length > 0,
  );

  return (
    <Box className={cn('flex min-w-0 flex-col gap-3', className)}>
      <UiToolbar
        left={
          <>
            {hasSearch ? (
              <Box className="w-full min-w-0 sm:w-[320px]">
                <UiSearchInput
                  value={searchValue ?? ''}
                  onChange={onSearchChange!}
                  onClear={onSearchClear}
                  placeholder={searchPlaceholder}
                  aria-label={searchPlaceholder ?? 'Search'}
                />
              </Box>
            ) : null}

            {hasSelect ? (
              <Box className="w-full min-w-0 sm:w-[240px]">
                <UiSelect
                  label={selectLabel}
                  value={selectValue}
                  onChange={onSelectChange}
                  options={selectOptions}
                  placeholder={selectPlaceholder}
                  aria-label={selectLabel ?? 'Filter'}
                />
              </Box>
            ) : null}
          </>
        }
        right={right}
      />

      {hasTabs ? (
        <Tabs
          value={tabValue ?? tabs![0]!.value}
          onChange={(_e, next) => onTabChange?.(String(next))}
          className="tabs--pills"
        >
          {tabs!.map((t) => (
            <Tab key={t.value} value={t.value} label={t.label} />
          ))}
        </Tabs>
      ) : null}
    </Box>
  );
}
