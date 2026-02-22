import { Box, Typography } from '@mui/material';

export const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        borderTop: 1,
        borderColor: 'divider',
        pt: 2,
        pb: 1,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography
        variant="caption"
        color="text.secondary"
        align="center"
        sx={{
          fontSize: '0.7rem',
          lineHeight: 1.4,
          display: 'block',
        }}
      >
        TMA Solutions CO., LTD. <br /> © 2024 All Rights Reserved
      </Typography>
    </Box>
  );
};
