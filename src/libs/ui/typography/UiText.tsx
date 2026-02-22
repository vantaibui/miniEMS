import Typography, { type TypographyProps } from '@mui/material/Typography';
import { forwardRef } from 'react';

import { cn } from '../utils/cn';
import type { UiTextProps, UiTextVariant, UiTextTone } from './UiText.types';

type MuiTypographyVariant = 'h4' | 'h6' | 'body1' | 'body2';

function mapVariant(variant: UiTextVariant): {
  muiVariant: MuiTypographyVariant;
  defaultComponent: React.ElementType;
} {
  switch (variant) {
    case 'heading':
      return { muiVariant: 'h4', defaultComponent: 'h1' };
    case 'subheading':
      return { muiVariant: 'h6', defaultComponent: 'h2' };
    case 'body':
      return { muiVariant: 'body1', defaultComponent: 'p' };
    case 'caption':
      return { muiVariant: 'body2', defaultComponent: 'span' };
    default: {
      const _exhaustive: never = variant;
      return _exhaustive;
    }
  }
}

/**
 * Maps semantic tones to MUI color props.
 * Note: Some semantic tones map to palette keys that MUI accepts natively.
 */
function mapToneToColor(tone: UiTextTone): TypographyProps['color'] {
  switch (tone) {
    case 'default':
      return 'textPrimary';
    case 'secondary':
      return 'textSecondary';
    case 'muted':
      return 'textDisabled';
    case 'danger':
      return 'error';
    case 'success':
      return 'success';
    case 'warning':
      return 'warning';
    case 'info':
      return 'info';
    default:
      return 'inherit';
  }
}

export const UiText = forwardRef<HTMLElement, UiTextProps>(
  (
    {
      children,
      variant = 'body',
      tone = 'default',
      align = 'inherit',
      noWrap = false,
      gutterBottom = false,
      className,
      component,
    },
    ref,
  ) => {
    const { muiVariant, defaultComponent } = mapVariant(variant);
    const muiColor = mapToneToColor(tone);

    return (
      <Typography
        ref={ref}
        variant={muiVariant}
        component={component || defaultComponent}
        align={align}
        noWrap={noWrap}
        gutterBottom={gutterBottom}
        className={cn(className)}
        color={muiColor}
      >
        {children}
      </Typography>
    );
  },
);

UiText.displayName = 'UiText';
