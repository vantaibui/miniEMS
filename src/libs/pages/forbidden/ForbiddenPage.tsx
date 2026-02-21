import { Box } from '@mui/material';

const ForbiddenPage = () => {
  return (
    <Box className="p-8">
      <Box className="rounded-2xl border border-(--color-divider) bg-white p-8">
        <Box component="h1" className="text-3xl font-extrabold text-red-600">
          403
        </Box>
        <Box component="h2" className="mt-2 text-xl font-semibold">
          Access Denied
        </Box>
        <Box className="mt-2 text-(--color-text-secondary)">
          You do not have the required permissions to view this page.
        </Box>
      </Box>
    </Box>
  );
};

export default ForbiddenPage;
