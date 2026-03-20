import { useState } from 'react';

import {
  type UiDataTableColumn,
  type UiDataTableId,
  AddIcon,
  Box,
  DownloadIcon,
  Stack,
  UiBadge,
  UiButton,
  UiCard,
  UiConfirmDialog,
  UiDataTable,
  UiFormField,
  UiInput,
  UiModal,
  UiSelect,
  UiTableFilters,
  UiText,
} from '@libs/ui';

// --- Mock Data ---
interface UserRow {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive';
}

const mockUsers: Array<UserRow> = [
  {
    id: 1,
    name: 'Alex Rivers',
    email: 'alex.rivers@tma.com.vn',
    role: 'Super Admin',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Sarah Chen',
    email: 'sarah.chen@tma.com.vn',
    role: 'Project Manager',
    status: 'Active',
  },
  {
    id: 3,
    name: 'Marco Verratti',
    email: 'marco.v@tma.com.vn',
    role: 'Viewer',
    status: 'Inactive',
  },
  {
    id: 4,
    name: 'John Doe',
    email: 'john.doe@tma.com.vn',
    role: 'Developer',
    status: 'Active',
  },
  {
    id: 5,
    name: 'Jane Smith',
    email: 'jane.smith@tma.com.vn',
    role: 'Designer',
    status: 'Active',
  },
];

const roleOptions = [
  { value: 'all', label: 'All Role Types' },
  { value: 'admin', label: 'Admin' },
  { value: 'editor', label: 'Editor' },
  { value: 'viewer', label: 'Viewer' },
];

const statusTabs = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('tables');
  const [searchValue, setSearchValue] = useState('');
  const [roleFilter, setRoleFilter] = useState<string | number>('all');
  const [statusTab, setStatusTab] = useState('all');
  const [selectedIds, setSelectedIds] = useState<Array<UiDataTableId>>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: 'delete' | 'warning' | 'success';
    title: string;
    description: string;
    confirmOnly?: boolean;
    confirmText?: string;
  }>({
    isOpen: false,
    type: 'success',
    title: '',
    description: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const userColumns: Array<UiDataTableColumn<UserRow>> = [
    {
      key: 'name',
      header: 'User Identity',
      render: (row) => (
        <Stack spacing={0}>
          <UiText variant="body" className="font-medium">
            {row.name}
          </UiText>
          <UiText variant="caption" tone="secondary">
            {row.email}
          </UiText>
        </Stack>
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
      render: (row) => (
        <UiBadge
          variant={row.status === 'Active' ? 'success' : 'neutral'}
          size="sm"
        >
          {row.status}
        </UiBadge>
      ),
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
  ];

  const handleSimulateLoading = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <Box className="p-8 space-y-6">
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack spacing={0.5}>
          <UiText variant="heading">Design System Showcase</UiText>
          <UiText variant="body" tone="secondary">
            Reusable UI component library built with React, MUI v7, and Tailwind
            v4.
          </UiText>
        </Stack>
        <UiButton startIcon={<DownloadIcon />} variant="secondary">
          Export Specs
        </UiButton>
      </Stack>

      <UiTableFilters
        tabs={[
          { value: 'atoms', label: 'Atoms' },
          { value: 'molecules', label: 'Molecules' },
          { value: 'tables', label: 'Tables & Organisms' },
        ]}
        tabValue={activeTab}
        onTabChange={setActiveTab}
      />

      <UiCard padding="lg">
        {activeTab === 'atoms' && (
          <Stack spacing={4}>
            <section className="space-y-4">
              <UiText variant="subheading">Buttons</UiText>
              <Stack direction="row" spacing={2} alignItems="center">
                <UiButton variant="primary">Primary</UiButton>
                <UiButton variant="secondary">Secondary</UiButton>
                <UiButton variant="ghost">Ghost</UiButton>
                <UiButton variant="danger">Danger</UiButton>
              </Stack>
              <Stack direction="row" spacing={2} alignItems="center">
                <UiButton size="sm">Small</UiButton>
                <UiButton size="md">Medium</UiButton>
                <UiButton size="lg">Large</UiButton>
              </Stack>
              <Stack direction="row" spacing={2} alignItems="center">
                <UiButton loading>Loading State</UiButton>
                <UiButton disabled>Disabled</UiButton>
              </Stack>
            </section>

            <section className="space-y-4">
              <UiText variant="subheading">Badges</UiText>
              <Stack direction="row" spacing={1}>
                <UiBadge variant="neutral">Default</UiBadge>
                <UiBadge variant="success">Success</UiBadge>
                <UiBadge variant="warning">Warning</UiBadge>
                <UiBadge variant="danger">Danger</UiBadge>
                <UiBadge variant="info">Info</UiBadge>
              </Stack>
            </section>

            <section className="space-y-4">
              <UiText variant="subheading">Typography</UiText>
              <UiText variant="heading">Heading - Inter Bold 1.875rem</UiText>
              <UiText variant="subheading">
                Subheading - Inter Medium 1rem
              </UiText>
              <UiText variant="body">
                Body - Inter Regular 1rem. Default text tone.
              </UiText>
              <UiText variant="caption" tone="secondary">
                Caption - Inter Regular 0.875rem. Secondary text tone.
              </UiText>
            </section>
          </Stack>
        )}

        {activeTab === 'molecules' && (
          <Stack spacing={4}>
            <section className="space-y-4">
              <UiText variant="subheading">Form Fields & Inputs</UiText>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                <UiFormField
                  label="Full Name"
                  required
                  helperText="Enter your legal name."
                >
                  <UiInput placeholder="e.g. Alex Rivers" />
                </UiFormField>
                <UiFormField
                  label="Security Role"
                  errorText="Please select a role."
                >
                  <UiSelect
                    options={roleOptions}
                    placeholder="Select a role..."
                  />
                </UiFormField>
                <UiFormField label="Search with Loading">
                  <UiInput loading placeholder="Processing..." />
                </UiFormField>
                <UiFormField label="Disabled Input">
                  <UiInput disabled defaultValue="Read only content" />
                </UiFormField>
              </div>
            </section>

            <section className="space-y-4">
              <UiText variant="subheading">Modals & Confirm Dialogs</UiText>
              <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                <UiButton onClick={() => setIsModalOpen(true)}>
                  Open Standard Modal
                </UiButton>

                <UiButton
                  variant="danger"
                  onClick={() =>
                    setConfirmDialog({
                      isOpen: true,
                      type: 'delete',
                      title: 'Delete User',
                      description:
                        'Are you sure you want to delete this user? This action cannot be undone.',
                    })
                  }
                >
                  Delete Confirm
                </UiButton>

                <UiButton
                  sx={{
                    backgroundColor: '#ED6C02',
                    '&:hover': { backgroundColor: '#E65100' },
                  }}
                  onClick={() =>
                    setConfirmDialog({
                      isOpen: true,
                      type: 'warning',
                      title: 'Warning',
                      description: 'Are you sure about this action?',
                    })
                  }
                >
                  Warning Confirm
                </UiButton>

                <UiButton
                  sx={{
                    backgroundColor: '#4CAF50',
                    '&:hover': { backgroundColor: '#2E7D32' },
                  }}
                  onClick={() =>
                    setConfirmDialog({
                      isOpen: true,
                      type: 'success',
                      title: 'Success',
                      description: 'Action is done successfully!',
                    })
                  }
                >
                  Success Confirm
                </UiButton>

                <UiButton
                  variant="secondary"
                  onClick={() =>
                    setConfirmDialog({
                      isOpen: true,
                      type: 'warning',
                      title: 'Something went wrong?',
                      description:
                        "We couldn't complete your request due to a server error. Please try again.",
                      confirmOnly: true,
                      confirmText: 'Retry',
                    })
                  }
                >
                  Retry (Confirm Only)
                </UiButton>
              </Stack>

              <UiModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Update User Profile"
                actions={
                  <>
                    <UiButton
                      variant="ghost"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Cancel
                    </UiButton>
                    <UiButton
                      loading={isLoading}
                      onClick={handleSimulateLoading}
                    >
                      Save Changes
                    </UiButton>
                  </>
                }
              >
                <Stack spacing={3} className="py-2">
                  <UiText variant="body">
                    Update the user details below. This action will be logged in
                    the audit history.
                  </UiText>
                  <UiFormField label="Display Name">
                    <UiInput defaultValue="Alex Rivers" />
                  </UiFormField>
                  <UiFormField label="Department">
                    <UiSelect
                      options={[{ value: 'it', label: 'IT' }]}
                      defaultValue="it"
                    />
                  </UiFormField>
                </Stack>
              </UiModal>

              <UiConfirmDialog
                isOpen={confirmDialog.isOpen}
                type={confirmDialog.type}
                title={confirmDialog.title}
                description={confirmDialog.description}
                confirmOnly={confirmDialog.confirmOnly}
                confirmText={confirmDialog.confirmText}
                onClose={() =>
                  setConfirmDialog((prev) => ({ ...prev, isOpen: false }))
                }
                onConfirm={() => {
                  console.log('Confirmed!');
                  setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
                }}
              />
            </section>
          </Stack>
        )}

        {activeTab === 'tables' && (
          <Stack spacing={4}>
            <UiTableFilters
              searchValue={searchValue}
              onSearchChange={setSearchValue}
              onSearchClear={() => setSearchValue('')}
              searchPlaceholder="Search by name or email..."
              selectOptions={roleOptions}
              selectValue={roleFilter}
              onSelectChange={setRoleFilter}
              tabs={statusTabs}
              tabValue={statusTab}
              onTabChange={setStatusTab}
              right={
                <UiButton
                  startIcon={<AddIcon />}
                  onClick={() => setIsModalOpen(true)}
                >
                  Add New User
                </UiButton>
              }
            />

            <UiDataTable
              rows={mockUsers}
              columns={userColumns}
              getRowId={(row) => row.id}
              selectable
              selectedIds={selectedIds}
              onSelectedIdsChange={setSelectedIds}
              pagination={{
                page: 0,
                rowsPerPage: 10,
                total: 128,
                onPageChange: (p) => console.log('Page:', p),
                onRowsPerPageChange: (rpp) => console.log('RPP:', rpp),
              }}
            />
          </Stack>
        )}
      </UiCard>
    </Box>
  );
}
