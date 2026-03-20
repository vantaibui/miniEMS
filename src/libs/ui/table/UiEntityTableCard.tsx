import { type ReactNode, useState } from 'react';

import FilterListIcon from '@mui/icons-material/FilterList';
import {
  Box,
  Card,
  MenuItem,
  Select,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';

export interface UiEntityTableCardProps {
  total: number;
  page: number;
  size: number;
  entityLabelPlural: string;
  filterLabel: string;
  filterPlaceholder?: string;
  children: ReactNode;
}

export const UiEntityTableCard = ({
  total,
  page,
  size,
  entityLabelPlural,
  filterLabel,
  filterPlaceholder,
  children,
}: UiEntityTableCardProps) => {
  const [tabValue, setTabValue] = useState(0);

  const from = total === 0 ? 0 : page * size + 1;
  const to = total === 0 ? 0 : Math.min(total, page * size + size);

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: '0px 2px 10px rgba(0,0,0,0.05)',
      }}
    >
      <Box
        sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Select
            value="All"
            size="small"
            sx={{
              minWidth: 160,
              bgcolor: 'transparent',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'divider' },
              '& .MuiSelect-select': {
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              },
              fontWeight: 600,
              fontSize: '0.875rem',
            }}
            displayEmpty
            renderValue={() => (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FilterListIcon
                  fontSize="small"
                  sx={{ color: 'text.secondary' }}
                />
                {filterPlaceholder ?? filterLabel}
              </Box>
            )}
          >
            <MenuItem value="All">{filterLabel}</MenuItem>
          </Select>

          <Tabs
            value={tabValue}
            onChange={(_, val) => setTabValue(val)}
            sx={{
              minHeight: 36,
              '& .MuiTab-root': {
                minHeight: 36,
                py: 0.5,
                px: 2,
                textTransform: 'none',
                fontWeight: 500,
                color: 'text.secondary',
              },
              '& .Mui-selected': { color: 'text.primary', fontWeight: 600 },
              '& .MuiTabs-indicator': { display: 'none' },
              bgcolor: 'transparent',
            }}
          >
            <Tab label="All" />
            <Tab label="Active" />
            <Tab label="Draft" />
          </Tabs>
        </Box>
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            fontWeight: 500,
          }}
        >
          <Box
            component="span"
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: 'primary.main',
              display: 'inline-block',
            }}
          />
          Showing {from}-{to} of {total} {entityLabelPlural}
        </Typography>
      </Box>

      <Box
        sx={{
          '& .MuiTableHead-root': {
            '& .MuiTableCell-root': {
              color: 'text.secondary',
              fontSize: '0.75rem',
              fontWeight: 600,
              bgcolor: 'transparent',
              letterSpacing: '0.5px',
            },
          },
          '& > div': { boxShadow: 'none', borderRadius: 0 },
        }}
      >
        {children}
      </Box>
    </Card>
  );
};
