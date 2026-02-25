import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { UiCard } from '../card';
import { cn } from '../utils/cn';
import type { UiDataTableProps } from './UiDataTable.types';

export function UiDataTable<TData>({
  rows,
  columns,
  getRowId,
  loading,
  emptyState,
  pagination,
  className,
  'aria-label': ariaLabel,
}: UiDataTableProps<TData>) {
  const colSpan = columns.length;

  return (
    <UiCard className={cn('overflow-hidden', className)}>
      <Table size="medium" aria-label={ariaLabel}>
        <colgroup>
          {columns.map((col) => (
            <col key={col.key} width={col.width} />
          ))}
        </colgroup>
        <TableHead
          sx={{
            '& .MuiTableCell-root': {
              backgroundColor: '#E5EAF2',
              fontWeight: 600,
              fontSize: '0.75rem',
              color: 'text.secondary',
              borderBottom: '1px solid',
              borderColor: 'divider',
            },
          }}
        >
          <TableRow>
            {columns.map((col) => (
              <TableCell key={col.key} align={col.align}>
                {col.header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={colSpan}>
                <Typography variant="body2" color="text.secondary">
                  Loading...
                </Typography>
              </TableCell>
            </TableRow>
          ) : rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={colSpan}>
                {emptyState ?? (
                  <Typography variant="body2" color="text.secondary">
                    No data
                  </Typography>
                )}
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row, index) => {
              const id = getRowId(row);

              return (
                <TableRow key={String(id)} hover>
                  {columns.map((col) => (
                    <TableCell key={col.key} align={col.align}>
                      {col.render(row, index)}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      {pagination ? (
        <TablePagination
          component="div"
          count={pagination.total}
          page={pagination.page}
          rowsPerPage={pagination.rowsPerPage}
          onPageChange={(_e, page) => pagination.onPageChange(page)}
          onRowsPerPageChange={(e) =>
            pagination.onRowsPerPageChange(Number(e.target.value))
          }
          rowsPerPageOptions={[10, 25, 50]}
        />
      ) : null}
    </UiCard>
  );
}
