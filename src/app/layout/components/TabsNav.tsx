import { Box, Tab, Tabs } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

import { TAB_GROUPS } from '@app/navigation';

function getActiveTabIndex(
  pathname: string,
  tabs: Array<{ path: string }>,
): number {
  const sorted = [...tabs].sort((a, b) => b.path.length - a.path.length);
  const matched = sorted.find(
    (t) => pathname === t.path || pathname.startsWith(`${t.path}/`),
  );
  if (!matched) return 0;
  const idx = tabs.findIndex((t) => t.path === matched.path);
  return idx >= 0 ? idx : 0;
}

export const TabsNav = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const group = TAB_GROUPS.find((g) => pathname.startsWith(g.matchPrefix));
  if (!group) return null;

  const { tabs } = group;
  const value = getActiveTabIndex(pathname, tabs);

  return (
    <Box className="-mx-6 border-t border-divider px-6 pt-2">
      <Tabs
        value={value}
        onChange={(_, v: number) => {
          const tab = tabs[v];
          if (tab) navigate(tab.path);
        }}
        className="min-h-10"
        sx={{
          borderBottom: 0,
          '& .MuiTabs-indicator': { backgroundColor: 'primary.main' },
        }}
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.path}
            label={tab.label}
            sx={{ textTransform: 'none' }}
          />
        ))}
      </Tabs>
    </Box>
  );
};
