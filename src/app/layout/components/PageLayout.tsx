import { type ReactNode, useEffect } from 'react';

import { Box } from '@mui/material';

import { DOCUMENT_TITLE_SUFFIX } from '@app/navigation';

import { Header, type HeaderProps } from './Header';

export type PageLayoutProps = HeaderProps & {
  children: ReactNode;
};

export const PageLayout = ({
  title,
  description,
  actions,
  children,
}: PageLayoutProps) => {
  useEffect(() => {
    document.title = `${title} | ${DOCUMENT_TITLE_SUFFIX}`;
  }, [title]);

  return (
    <Box className="flex min-h-full flex-col">
      <Header title={title} description={description} actions={actions} />

      <Box className="min-h-0 flex-1 bg-[#F1F5F9] p-6">
        <Box className="rounded-lg shadow-sm">
          {children}
        </Box>
      </Box>
    </Box>
  );
};
