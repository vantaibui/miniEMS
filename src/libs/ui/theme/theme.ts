import { createTheme } from '@mui/material/styles';

import { tokens } from './tokens';

// Project uses single-theme mode by design

const baseTheme = createTheme({
  cssVariables: true,
  typography: {
    fontFamily: tokens.typography.fontFamily.sans,
    h1: {
      fontSize: tokens.typography.sizes['4xl'],
      fontWeight: tokens.typography.fontWeight.bold,
    },
    h2: {
      fontSize: tokens.typography.sizes['3xl'],
      fontWeight: tokens.typography.fontWeight.bold,
    },
    h3: {
      fontSize: tokens.typography.sizes['2xl'],
      fontWeight: tokens.typography.fontWeight.bold,
    },
    h4: {
      fontSize: tokens.typography.sizes.xl,
      fontWeight: tokens.typography.fontWeight.medium,
    },
    h5: {
      fontSize: tokens.typography.sizes.lg,
      fontWeight: tokens.typography.fontWeight.medium,
    },
    h6: {
      fontSize: tokens.typography.sizes.base,
      fontWeight: tokens.typography.fontWeight.medium,
    },
    body1: { fontSize: tokens.typography.sizes.base },
    body2: { fontSize: tokens.typography.sizes.sm },
    button: {
      textTransform: 'none',
      fontWeight: tokens.typography.fontWeight.medium,
    },
  },
  shape: {
    borderRadius: tokens.shape.borderRadius.md,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: tokens.shape.borderRadius.md,
          padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: tokens.shadows.sm,
          },
        },
        containedPrimary: {
          backgroundColor: tokens.colors.primary[600],
          '&:hover': {
            backgroundColor: tokens.colors.primary[700],
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: tokens.shape.borderRadius.md,
          alignItems: 'center',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: tokens.colors.neutral[200],
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: tokens.colors.neutral[300],
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: tokens.colors.primary[600],
            borderWidth: 1.5,
          },
          '&.Mui-disabled': {
            backgroundColor: tokens.colors.neutral[100],
          },
          '&.Mui-error .MuiOutlinedInput-notchedOutline': {
            borderColor: tokens.colors.error.main,
          },
        },
        input: {
          padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
          lineHeight: 1.5,
        },
        inputSizeSmall: {
          padding: `${tokens.spacing.xs} ${tokens.spacing.sm}`,
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          display: 'flex',
          alignItems: 'center',
        },
        icon: {
          top: '50%',
          transform: 'translateY(-50%)',
        },
      },
    },
    MuiInputAdornment: {
      styleOverrides: {
        root: {
          display: 'flex',
          alignItems: 'center',
          alignSelf: 'center',
          maxHeight: 'none',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: tokens.colors.neutral[700],
          '&.Mui-focused': {
            color: tokens.colors.primary[600],
          },
          '&.Mui-error': {
            color: tokens.colors.error.main,
          },
          '&.Mui-disabled': {
            color: tokens.colors.neutral[400],
          },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          marginLeft: 0,
          marginRight: 0,
          fontSize: tokens.typography.sizes.xs,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: tokens.shape.borderRadius.lg,
          boxShadow: tokens.shadows.sm,
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: 0,
          '&:last-child': {
            paddingBottom: 0,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          border: 'none',
          backgroundImage: 'none',
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          border: `1px solid ${tokens.colors.neutral[200]}`,
          borderRadius: tokens.shape.borderRadius.lg,
          overflow: 'hidden',
          backgroundColor: tokens.colors.neutral[50],
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: tokens.typography.fontWeight.medium,
          color: tokens.colors.neutral[900],
          backgroundColor: tokens.colors.neutral[50],
          borderBottom: `1px solid ${tokens.colors.neutral[200]}`,
        },
        body: {
          padding: tokens.spacing.sm,
          borderBottom: `1px solid ${tokens.colors.neutral[200]}`,
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: tokens.colors.neutral[100],
          },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: tokens.colors.neutral[100],
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: 'auto',
          borderBottom: `1px solid ${tokens.colors.neutral[200]}`,
          '&.tabs--pills': {
            borderBottom: 0,
            '& .MuiTabs-indicator': {
              display: 'none',
            },
          },
        },
        indicator: {
          backgroundColor: tokens.colors.primary[600],
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: tokens.typography.fontWeight.medium,
          fontSize: tokens.typography.sizes.sm,
          color: tokens.colors.neutral[600],
          minHeight: tokens.components.tab.minHeight,
          minWidth: 'auto',
          padding: `${tokens.spacing.xs} ${tokens.spacing.md}`,
          '&.Mui-selected': {
            color: tokens.colors.primary[600],
          },
          '.tabs--pills &': {
            borderRadius: tokens.shape.borderRadius.md,
            marginRight: tokens.spacing.sm,
            '&.Mui-selected': {
              backgroundColor: tokens.colors.neutral[100],
              color: tokens.colors.neutral[900],
              border: `1px solid ${tokens.colors.neutral[200]}`,
            },
            '&:hover': {
              backgroundColor: tokens.colors.neutral[50],
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: tokens.shape.borderRadius.full,
          fontWeight: tokens.typography.fontWeight.medium,
          fontSize: tokens.components.chip.fontSize.md,
          height: tokens.components.chip.height.md,
          '&.MuiChip-outlined': {
            backgroundColor: tokens.colors.neutral[50],
            borderColor: tokens.colors.neutral[200],
            color: tokens.colors.neutral[700],
          },
          '&.MuiChip-filled.MuiChip-colorSuccess': {
            backgroundColor: tokens.colors.success.light,
            color: tokens.colors.neutral[50],
          },
          '&.MuiChip-filled.MuiChip-colorError': {
            backgroundColor: tokens.colors.error.light,
            color: tokens.colors.neutral[50],
          },
          '&.MuiChip-filled.MuiChip-colorWarning': {
            backgroundColor: tokens.colors.warning.light,
            color: tokens.colors.neutral[50],
          },
          '&.MuiChip-filled.MuiChip-colorInfo': {
            backgroundColor: tokens.colors.primary[400],
            color: tokens.colors.neutral[50],
          },
        },
        sizeSmall: {
          height: tokens.components.chip.height.sm,
          fontSize: tokens.components.chip.fontSize.sm,
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          boxShadow: tokens.shadows.md,
          border: `1px solid ${tokens.colors.neutral[200]}`,
          borderRadius: tokens.shape.borderRadius.md,
          backgroundImage: 'none',
        },
        list: {
          paddingTop: tokens.spacing.xs,
          paddingBottom: tokens.spacing.xs,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          paddingLeft: tokens.spacing.md,
          paddingRight: tokens.spacing.md,
          paddingTop: tokens.spacing.sm,
          paddingBottom: tokens.spacing.sm,
          gap: tokens.spacing.sm,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: tokens.shape.borderRadius.lg,
          border: `1px solid ${tokens.colors.neutral[200]}`,
          boxShadow: tokens.shadows.lg,
          backgroundImage: 'none',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          padding: `${tokens.spacing.lg} ${tokens.spacing.lg} ${tokens.spacing.sm}`,
          fontSize: tokens.typography.sizes.xl,
          fontWeight: tokens.typography.fontWeight.bold,
          color: tokens.colors.neutral[900],
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: `${tokens.spacing.sm} ${tokens.spacing.lg}`,
        },
        dividers: {
          borderTop: `1px solid ${tokens.colors.neutral[200]}`,
          borderBottom: `1px solid ${tokens.colors.neutral[200]}`,
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: `${tokens.spacing.sm} ${tokens.spacing.lg} ${tokens.spacing.lg}`,
          gap: tokens.spacing.sm,
        },
      },
    },
  },
});

export const theme = createTheme(baseTheme, {
  palette: {
    mode: 'light',
    primary: {
      main: tokens.colors.primary[600],
      light: tokens.colors.primary[400],
      dark: tokens.colors.primary[800],
      contrastText: tokens.colors.neutral[50],
    },
    secondary: {
      main: tokens.colors.secondary[500],
      light: tokens.colors.secondary[300],
      dark: tokens.colors.secondary[700],
      contrastText: tokens.colors.neutral[50],
    },
    error: tokens.colors.error,
    warning: tokens.colors.warning,
    success: tokens.colors.success,
    text: {
      primary: tokens.colors.neutral[900],
      secondary: tokens.colors.neutral[600],
      disabled: tokens.colors.neutral[400],
    },
    background: {
      default: tokens.colors.neutral[50],
      paper: tokens.colors.neutral[50],
    },
    divider: tokens.colors.neutral[200],
  },
});
