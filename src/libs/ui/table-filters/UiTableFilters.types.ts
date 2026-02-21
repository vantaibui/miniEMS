import type { ReactNode } from 'react';
import type { UiSelectOption, UiSelectOptionValue } from '../select';

export interface UiTableFiltersTab {
  value: string;
  label: ReactNode;
  count?: number;
}

export interface UiTableFiltersProps {
  // Search
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onSearchClear?: () => void;
  searchPlaceholder?: string;

  // Select
  selectValue?: UiSelectOptionValue;
  onSelectChange?: (value: UiSelectOptionValue) => void;
  selectOptions?: Array<UiSelectOption>;
  selectPlaceholder?: string;
  selectLabel?: string;

  // Tabs (Pills)
  tabs?: Array<UiTableFiltersTab>;
  tabValue?: string;
  onTabChange?: (value: string) => void;

  // Layout
  className?: string;
  right?: ReactNode;
}
