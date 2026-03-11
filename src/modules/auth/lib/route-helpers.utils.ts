import type { ComponentType } from 'react';
import React from 'react';
import type { RouteObject } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

import { RouteGuard } from '../components/guards/PermissionGuard';
import { PERMISSION_ACTIONS } from '../constants/permissions.constants';

interface CrudPages {
  list: ComponentType;
  create?: ComponentType;
  edit?: ComponentType;
}

interface CreateCrudRoutesOptions {
  /**
   * Base path for the resource, e.g. "users" or "roles".
   */
  basePath: string;
  /**
   * RBAC permission prefix, e.g. "USER_MANAGEMENT".
   * Helper will map this to `${permissionPrefix}.read|create|update`.
   */
  permissionPrefix: string;
  pages: CrudPages;
  /**
   * When true, also generate `${basePath}/:id` that redirects to `edit`.
   */
  redirectDetailToEdit?: boolean;
}

/**
 * Helper to standardize CRUD routes with RouteGuard for list/create/edit modules.
 */
export const createCrudRoutes = ({
  basePath,
  permissionPrefix,
  pages,
  redirectDetailToEdit,
}: CreateCrudRoutesOptions): Array<RouteObject> => {
  const routes: Array<RouteObject> = [];
  const { list: ListPage, create: CreatePage, edit: EditPage } = pages;

  // List
  routes.push({
    path: basePath,
    element: React.createElement(RouteGuard, {
      subModuleKey: permissionPrefix,
      actionKey: PERMISSION_ACTIONS.READ,
      children: React.createElement(ListPage),
    }),
  });

  // Create
  if (CreatePage) {
    routes.push({
      path: `${basePath}/create`,
      element: React.createElement(RouteGuard, {
        subModuleKey: permissionPrefix,
        actionKey: PERMISSION_ACTIONS.CREATE,
        children: React.createElement(CreatePage),
      }),
    });
  }

  // Edit
  if (EditPage) {
    routes.push({
      path: `${basePath}/:id/edit`,
      element: React.createElement(RouteGuard, {
        subModuleKey: permissionPrefix,
        actionKey: PERMISSION_ACTIONS.UPDATE,
        children: React.createElement(EditPage),
      }),
    });
  }

  // Optional redirect from /:id -> /:id/edit
  if (redirectDetailToEdit && EditPage) {
    routes.push({
      path: `${basePath}/:id`,
      element: React.createElement(Navigate, { to: 'edit', replace: true }),
    });
  }

  return routes;
};
