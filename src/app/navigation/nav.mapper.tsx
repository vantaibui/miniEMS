import type { ReactNode } from 'react';

import type { NavGroup, NavItem } from './nav.types';

/**
 * Mapper to convert generic `navigationConfig` (sections/items) into the `NavGroup`
 * structure expected by `SidebarNav`.
 */
export function mapNavigationConfigToNavGroups(
  sections: Array<NavGroup>,
): Array<NavGroup> {
  return sections.map(
    ({ key, section, permissionPath, items }): NavGroup => ({
      key,
      section,
      permissionPath,
      items: items.map(({ key, label, to, icon, permissionPath }): NavItem => {
        const Icon = icon;
        return {
          key,
          label,
          to,
          icon: (Icon ? (
            typeof Icon === 'function' ? (
              <Icon />
            ) : (
              Icon
            )
          ) : null) as ReactNode,
          permissionPath,
        };
      }),
    }),
  );
}
