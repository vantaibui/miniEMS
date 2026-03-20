import { useMemo, useState } from 'react';

import {
  type UiDataTableColumn,
  type UiDataTableId,
  UiBadge,
  UiButton,
  UiCard,
  UiDataTable,
  UiTableFilters,
  UiText,
} from '@libs/ui';

interface DemoRow {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive' | 'Pending';
  lastActive: string;
}

const mockData: Array<DemoRow> = [
  {
    id: 1,
    name: 'Alex Rivers',
    email: 'alex.rivers@tma.com.vn',
    role: 'Super Admin',
    status: 'Active',
    lastActive: 'Just now',
  },
  {
    id: 2,
    name: 'Sarah Chen',
    email: 'sarah.chen@tma.com.vn',
    role: 'Project Manager',
    status: 'Active',
    lastActive: '15 mins ago',
  },
  {
    id: 3,
    name: 'Marco Verratti',
    email: 'marco.v@tma.com.vn',
    role: 'Viewer',
    status: 'Inactive',
    lastActive: '12 days ago',
  },
  {
    id: 4,
    name: 'John Doe',
    email: 'john.doe@tma.com.vn',
    role: 'Developer',
    status: 'Pending',
    lastActive: 'N/A',
  },
  {
    id: 5,
    name: 'Jane Smith',
    email: 'jane.smith@tma.com.vn',
    role: 'Designer',
    status: 'Active',
    lastActive: '2 hours ago',
  },
];

/**
 * Demo for DataTable organism.
 * Demonstrates:
 * - Typed columns with custom renders
 * - Row selection (controlled)
 * - Built-in pagination
 * - Integration with TableFilters
 */
export const TableDemo = () => {
  const [selectedIds, setSelectedIds] = useState<Array<UiDataTableId>>([]);
  const [searchValue, setSearchValue] = useState('');
  const [statusTab, setStatusTab] = useState('all');
  const [loading, setLoading] = useState(false);

  const columns = useMemo<Array<UiDataTableColumn<DemoRow>>>(
    () => [
      {
        key: 'identity',
        header: 'User Identity',
        render: (row) => (
          <div className="flex flex-col">
            <UiText variant="body" className="font-medium">
              {row.name}
            </UiText>
            <UiText variant="caption" tone="secondary">
              {row.email}
            </UiText>
          </div>
        ),
      },
      {
        key: 'role',
        header: 'Security Role',
        render: (row) => (
          <UiBadge variant="info" size="sm">
            {row.role.toUpperCase()}
          </UiBadge>
        ),
      },
      {
        key: 'status',
        header: 'Status',
        render: (row) => {
          const variantMap: Record<
            DemoRow['status'],
            'success' | 'neutral' | 'warning' | 'info'
          > = {
            Active: 'success',
            Inactive: 'neutral',
            Pending: 'warning',
          };
          return (
            <UiBadge variant={variantMap[row.status]} size="sm">
              {row.status}
            </UiBadge>
          );
        },
      },
      {
        key: 'lastActive',
        header: 'Last Activity',
        render: (row) => <UiText variant="body">{row.lastActive}</UiText>,
      },
      {
        key: 'actions',
        header: 'Actions',
        align: 'right',
        render: () => (
          <UiButton variant="ghost" size="sm">
            Edit
          </UiButton>
        ),
      },
    ],
    [],
  );

  const handleSimulateLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <UiText variant="heading" gutterBottom>
          Data Tables
        </UiText>
        <UiText variant="caption" tone="secondary">
          Complex table organism with selection, pagination, and filters.
        </UiText>
      </div>

      <UiCard padding="none">
        <div className="p-4 space-y-4">
          <UiTableFilters
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            onSearchClear={() => setSearchValue('')}
            searchPlaceholder="Search users..."
            tabs={[
              { value: 'all', label: 'All' },
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
            ]}
            tabValue={statusTab}
            onTabChange={setStatusTab}
            right={
              <UiButton
                variant="secondary"
                size="sm"
                onClick={handleSimulateLoading}
                loading={loading}
              >
                Refresh Data
              </UiButton>
            }
          />
        </div>

        <UiDataTable
          rows={mockData}
          columns={columns}
          getRowId={(row) => row.id}
          selectable
          selectedIds={selectedIds}
          onSelectedIdsChange={setSelectedIds}
          loading={loading}
          pagination={{
            page: 0,
            rowsPerPage: 10,
            total: 128,
            onPageChange: (p) => console.log('Page change:', p),
            onRowsPerPageChange: (r) => console.log('Rows per page change:', r),
          }}
        />
      </UiCard>
    </div>
  );
};
