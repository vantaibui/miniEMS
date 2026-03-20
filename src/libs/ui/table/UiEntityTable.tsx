import type { ReactNode } from 'react';

import { Box, Card, Typography } from '@mui/material';

export interface UiEntityTableCardProps {
  title?: ReactNode;
  actions?: ReactNode;
  filters?: ReactNode;
  search?: ReactNode;
  tableContent: ReactNode;
  pagination?: ReactNode;
}

export const UiEntityTableCard = ({
  title,
  actions,
  filters,
  search,
  tableContent,
  pagination,
}: UiEntityTableCardProps) => {
  return (
    <Card className="rounded-lg shadow-sm">
      {(title || actions) && (
        <Box className="flex items-center justify-between border-b border-divider px-4 py-3">
          <Box className="min-w-0">
            {typeof title === 'string' ? (
              <Typography
                variant="subtitle1"
                color="text.primary"
                className="truncate"
              >
                {title}
              </Typography>
            ) : (
              title
            )}
          </Box>
          {actions ? <Box className="ml-4 shrink-0">{actions}</Box> : null}
        </Box>
      )}

      {(filters || search) && (
        <Box className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
          <Box className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
            {filters ? <Box className="min-w-0">{filters}</Box> : null}
            {search ? <Box className="min-w-0">{search}</Box> : null}
          </Box>
        </Box>
      )}

      <Box className="min-w-0">{tableContent}</Box>

      {pagination ? (
        <Box className="border-t border-divider px-4 py-3">{pagination}</Box>
      ) : null}
    </Card>
  );
};
