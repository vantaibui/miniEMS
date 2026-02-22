import { Box, Card, Stack, Typography, Badge } from '@mui/material';
import { GroupIcon, SecurityIcon, VpnKeyIcon, WarningIcon } from '@libs/ui';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  badge?: string;
  badgeColor?: 'success' | 'error' | 'primary' | 'warning';
  description?: string;
  isError?: boolean;
}

const StatCard = ({
  title,
  value,
  icon,
  badge,
  badgeColor = 'primary',
  description,
  isError,
}: StatCardProps) => {
  return (
    <Card
      variant="outlined"
      sx={{
        p: 2.5,
        borderRadius: 4,
        height: '100%',
        bgcolor: isError ? 'primary.main' : 'background.paper',
        color: isError ? 'white' : 'text.primary',
        borderColor: isError ? 'primary.main' : 'divider',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          mb: 2,
        }}
      >
        <Box
          sx={{
            p: 1,
            borderRadius: 2,
            bgcolor: isError ? 'rgba(255,255,255,0.1)' : 'action.hover',
            color: isError ? 'white' : 'primary.main',
            display: 'flex',
          }}
        >
          {icon}
        </Box>
        {badge && (
          <Box
            sx={{
              px: 1,
              py: 0.5,
              borderRadius: 1,
              fontSize: '0.625rem',
              fontWeight: 700,
              bgcolor: isError ? 'error.main' : `${badgeColor}.main`,
              color: 'white',
              textTransform: 'uppercase',
            }}
          >
            {badge}
          </Box>
        )}
      </Box>

      <Box>
        <Typography
          variant="caption"
          sx={{
            fontWeight: 700,
            opacity: isError ? 0.8 : 0.6,
            letterSpacing: 0.5,
          }}
        >
          {title}
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 800, mt: 0.5 }}>
          {value}
        </Typography>
        {description && (
          <Typography
            variant="caption"
            sx={{ mt: 1, display: 'block', opacity: 0.8, fontSize: '0.75rem' }}
          >
            {description}
          </Typography>
        )}
      </Box>
    </Card>
  );
};

export const RoleListStats = () => {
  return (
    <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="TOTAL ROLES"
        value="14"
        icon={<GroupIcon sx={{ fontSize: 20 }} />}
        badge="+2 new"
        badgeColor="success"
      />
      <StatCard
        title="CUSTOM ROLES"
        value="6"
        icon={<SecurityIcon sx={{ fontSize: 20 }} />}
        badge="Manual"
        badgeColor="neutral"
      />
      <StatCard
        title="ACTIVE PERMISSIONS"
        value="182"
        icon={<VpnKeyIcon sx={{ fontSize: 20 }} />}
        badge="Audited"
        badgeColor="primary"
      />
      <StatCard
        title="PERMISSION CONFLICTS"
        value="3"
        icon={<WarningIcon sx={{ fontSize: 20 }} />}
        badge="High Alert"
        badgeColor="error"
        description="Action required: Overlapping rules detected."
        isError
      />
    </div>
  );
};
