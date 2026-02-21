import React from 'react';
import { Link } from 'react-router-dom';

import { Breadcrumbs as MuiBreadcrumbs, Typography } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import type { BreadcrumbProps } from './UiBreadcrumb.types';


const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '' }) => {
  return (
    <MuiBreadcrumbs
      separator={<NavigateNextIcon fontSize="small" />} 
      aria-label="breadcrumb"
      className={className}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        
        if (isLast || !item.href) {
          return (
            <Typography 
              key={index} 
              color="text.primary" 
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 500, fontSize: '0.875rem' }}
            >
              {item.icon}
              {item.label}
            </Typography>
          );
        }

        return (
          <Link
            key={index}
            to={item.href}
            style={{ textDecoration: 'none' }}
          >
            <Typography 
              color="text.secondary" 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 0.5, 
                fontSize: '0.875rem',
                '&:hover': { color: 'primary.main' }
              }}
            >
              {item.icon}
              {item.label}
            </Typography>
          </Link>
        );
      })}
    </MuiBreadcrumbs>
  );
};

export { Breadcrumb };
