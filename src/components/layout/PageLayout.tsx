import { type ReactNode, useEffect } from 'react';

import { Box } from '@mui/material';

import { Header } from './Header';

import type { HeaderProps } from './Header';

const APP_NAME = 'miniEMS';

export type PageLayoutProps = HeaderProps & {
  children: ReactNode;
};

export const PageLayout = ({
  title,
  breadcrumbs,
  description,
  actions,
  children,
}: PageLayoutProps) => {
  useEffect(() => {
    document.title = `${title} | ${APP_NAME}`;
  }, [title]);
  return (
    <Box className="flex min-h-full flex-col">
      <Header
        title={title}
        breadcrumbs={breadcrumbs}
        description={description}
        actions={actions}
      />

      <Box className="min-h-0 flex-1 p-6 bg-[#F1F5F9]">
        <Box className="rounded-lg shadow-sm">
          {children}
        </Box>
      </Box>
    </Box>
  );
};
