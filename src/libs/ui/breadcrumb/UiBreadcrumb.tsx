import React from 'react';

import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Breadcrumbs as MuiBreadcrumbs, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';

import type { BreadcrumbProps } from './UiBreadcrumb.types';

const UiBreadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '' }) => {
  return (
    <MuiBreadcrumbs
      separator={
        <NavigateNextIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
      }
      aria-label="breadcrumb"
      className={`${className} pt-2`}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const isFirst = index === 0;

        const content = (
          <Box
            component="span"
            sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
          >
            {isFirst && (
              <HomeIcon
                sx={{
                  fontSize: 16,
                  mr: 0.5,
                  color: isLast ? 'text.primary' : 'text.secondary',
                }}
              />
            )}
            {item.icon}
            {item.label}
          </Box>
        );

        if (isLast || !item.href) {
          return (
            <Typography
              key={index}
              sx={{
                fontWeight: isLast ? 600 : 400,
                fontSize: '0.8125rem',
                color: isLast ? 'primary.main' : 'text.primary',
              }}
            >
              {content}
            </Typography>
          );
        }

        return (
          <Link key={index} to={item.href} style={{ textDecoration: 'none' }}>
            <Typography
              color="text.secondary"
              sx={{
                fontSize: '0.8125rem',
                '&:hover': {
                  color: 'primary.main',
                  textDecoration: 'underline',
                },
              }}
            >
              {content}
            </Typography>
          </Link>
        );
      })}
    </MuiBreadcrumbs>
  );
};

UiBreadcrumb.displayName = 'UiBreadcrumb';

export { UiBreadcrumb };
