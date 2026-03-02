import { Box, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

export const DeviceInventoryEditPage = () => {
  const { id } = useParams();

  // TODO: sẽ load detail device dựa trên id khi có API.
  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Edit Device
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Editing device with ID: {id}
      </Typography>
    </Box>
  );
};

