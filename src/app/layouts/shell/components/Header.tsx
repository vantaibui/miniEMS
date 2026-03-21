import { Box, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';

import type { SidebarTopItem } from '../../../navigation/nav.types';

interface HeaderProps {
  height?: number;
  sidebarItems?: Array<SidebarTopItem>;
}

export const Header = ({ height = 56, sidebarItems = [] }: HeaderProps) => {
  const location = useLocation();

  const activeItem = sidebarItems.find((item) =>
    item.pathPrefixes.some(
      (prefix) =>
        location.pathname === prefix ||
        location.pathname.startsWith(`${prefix}/`),
    ),
  );

  const title = activeItem?.label?.toUpperCase() ?? 'ADMINISTRATION';

  return (
    <Box
      component="header"
      sx={{ height }}
      className="sticky top-0 z-1100 flex shrink-0 items-center border-b border-divider bg-surface-card px-4 md:px-5"
    >
      <Typography
        variant="h6"
        fontWeight={700}
        className="text-text-primary"
        sx={{ letterSpacing: '0.04em' }}
      >
        {title}
      </Typography>
    </Box>
  );
};
