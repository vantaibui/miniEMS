import Checkbox from '@mui/material/Checkbox';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { UiCard } from '../card';
import { cn } from '../utils/cn';
import type { UiDataTableId, UiDataTableProps } from './UiDataTable.types';

function toSet(ids: Array<UiDataTableId> | undefined) {
  return new Set<UiDataTableId>(ids ?? []);
}

export function UiDataTable<TData>({
  rows,
  columns,
  getRowId,
  loading,
  emptyState,
  selectable,
  selectedIds,
  onSelectedIdsChange,
  pagination,
  className,
  'aria-label': ariaLabel,
}: UiDataTableProps<TData>) {
  const selectedSet = toSet(selectedIds);
  const hasSelection = Boolean(selectable);

  const allSelectableIds = rows.map(getRowId);
  const selectedCount = allSelectableIds.filter((id) =>
    selectedSet.has(id),
  ).length;
  const allSelected =
    hasSelection && rows.length > 0 && selectedCount === rows.length;
  const someSelected =
    hasSelection && selectedCount > 0 && selectedCount < rows.length;

  const toggleAll = (checked: boolean) => {
    if (!hasSelection) return;
    onSelectedIdsChange?.(checked ? allSelectableIds : []);
  };

  const toggleOne = (rowId: UiDataTableId, checked: boolean) => {
    if (!hasSelection) return;
    const next = new Set(selectedSet);
    if (checked) next.add(rowId);
    else next.delete(rowId);
    onSelectedIdsChange?.(Array.from(next));
  };

  const colSpan = columns.length + (hasSelection ? 1 : 0);

  return (
    <UiCard padding="none" className={cn('overflow-hidden', className)}>
      <Table size="medium" aria-label={ariaLabel}>
        <colgroup>
          {hasSelection ? <col width="48" /> : null}
          {columns.map((col) => (
            <col key={col.key} width={col.width} />
          ))}
        </colgroup>
        <TableHead>
          <TableRow>
            {hasSelection ? (
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={someSelected}
                  checked={allSelected}
                  onChange={(e) => toggleAll(e.target.checked)}
                  inputProps={{ 'aria-label': 'Select all rows' }}
                  disabled={loading || rows.length === 0}
                />
              </TableCell>
            ) : null}

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
            rows.map((row) => {
              const id = getRowId(row);
              const isChecked = selectedSet.has(id);

              return (
                <TableRow key={String(id)} hover>
                  {hasSelection ? (
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isChecked}
                        onChange={(e) => toggleOne(id, e.target.checked)}
                        inputProps={{
                          'aria-label': `Select row ${String(id)}`,
                        }}
                        disabled={loading}
                      />
                    </TableCell>
                  ) : null}

                  {columns.map((col) => (
                    <TableCell key={col.key} align={col.align}>
                      {col.render(row)}
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
