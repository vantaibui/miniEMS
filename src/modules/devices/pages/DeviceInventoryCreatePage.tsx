import { Box, Typography } from '@mui/material';

export const DeviceInventoryCreatePage = () => {
  // TODO: sẽ được thay bằng form tạo device thật (react-hook-form + API) sau.
  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Create Device
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Device creation form will be implemented here.
      </Typography>
    </Box>
  );
};

