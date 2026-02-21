import { Box, Typography } from '@mui/material';

export const Footer = () => {
  return (
    <Box
      component="footer"
      className="border-t pt-3 text-center"
      sx={{ borderColor: 'divider' }}
    >
      <Typography variant="caption" color="text.secondary" className='text-center'>
        TMA Solutions CO., LTD. <br /> © 2024 All Rights Reserved
      </Typography>
    </Box>
  );
};