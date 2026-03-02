import { Box } from '@mui/material';

import type { PaginationResult } from '@services/http';

import { DeviceInventoryTable } from '../components/DeviceInventoryTable';
import type { Device } from '../types';

const initialPagination: PaginationResult = {
  page: 0,
  size: 10,
  totalElements: 0,
  totalPages: 0,
};

export const DeviceInventoryListPage = () => {
  // TODO: khi có API thật, thay thế rows/pagination bằng react-query.
  const rows: Array<Device> = [];
  const pagination = initialPagination;

  const handlePaginationChange = (next: { page: number; size: number }) => {
    // placeholder – sau này sẽ trigger refetch
    console.log('Change pagination', next);
  };

  const handleEdit = (id: number) => {
    console.log('Edit device', id);
  };

  const handleDelete = (id: number) => {
    console.log('Delete device', id);
  };

  return (
    <Box>
      <DeviceInventoryTable
        rows={rows}
        loading={false}
        onEdit={handleEdit}
        onDelete={handleDelete}
        pagination={pagination}
        onPaginationChange={handlePaginationChange}
      />
    </Box>
  );
};

