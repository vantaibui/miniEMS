import { Box, Typography } from '@mui/material';

export const Footer = () => {
  return (
    <Box
      component="footer"
      className="flex w-full flex-col items-center justify-center border-t border-divider pb-1 pt-2"
    >
      <Typography
        variant="caption"
        color="text.secondary"
        align="center"
        className="block text-[0.7rem] leading-[1.4]"
      >
        TMA Solutions CO., LTD. <br /> © 2024 All Rights Reserved
      </Typography>
    </Box>
  );
};
