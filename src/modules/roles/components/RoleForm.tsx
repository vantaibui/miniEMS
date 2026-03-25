import { yupResolver } from '@hookform/resolvers/yup';
import DeleteIcon from '@mui/icons-material/Delete';
import SecurityIcon from '@mui/icons-material/Security';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { Box, Card, Grid, Stack, Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';

import { UiButton, UiFormActions, UiFormField, UiInput, tokens } from '@libs/ui';

import type { PaginationResult } from '@services/http';

import { RolePermissionMatrix } from './RolePermissionMatrix';

import type { CreateRolePayload, PermissionNode } from '../types';

const schema = yup.object().shape({
  name: yup.string().required('Role name is required').min(2).max(50),
  description: yup.string(),
  permissions: yup
    .array()
    .of(
      yup.object().shape({
        id: yup.number().required(),
        actions: yup.object().shape({
          create: yup.boolean().required(),
          read: yup.boolean().required(),
          update: yup.boolean().required(),
          delete: yup.boolean().required(),
        }),
      }),
    )
    .default([]),
});

interface RoleFormProps {
  initialValues?: CreateRolePayload;
  Permissions: Array<PermissionNode>;
  onSubmit: (data: CreateRolePayload) => void;
  onCancel: () => void;
  onDelete?: () => void;
  isLoading?: boolean;
  submitLabel?: string;
  isEdit?: boolean;
  permissionsPagination?: PaginationResult;
  onPermissionsPaginationChange?: (next: {
    page: number;
    size: number;
  }) => void;
  isPermissionsLoading?: boolean;
}

export const RoleForm = ({
  initialValues,
  Permissions,
  onSubmit,
  onCancel,
  onDelete,
  isLoading,
  submitLabel = 'Save Role',
  isEdit = false,
  permissionsPagination,
  onPermissionsPaginationChange,
  isPermissionsLoading,
}: RoleFormProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm<CreateRolePayload>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(schema) as any,
    mode: 'onChange',
    defaultValues: initialValues || {
      name: '',
      description: '',
      permissions: [],
    },
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Card
        sx={{
          p: { md: 3 },
          borderRadius: 3,
          boxShadow: tokens.shadows.sm,
        }}
      >
        <Stack spacing={4}>
          <Box>
            <Box
              sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}
            >
              <SecurityIcon color="primary" />
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 700, letterSpacing: '0.5px' }}
              >
                ROLE INFORMATION
              </Typography>
            </Box>

            <Grid container spacing={4}>
              <Grid size={{ xs: 6 }}>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <UiFormField
                      label="ROLE NAME"
                      errorText={errors.name?.message}
                      required
                    >
                      <UiInput {...field} placeholder="e.g. Regional Manager" />
                    </UiFormField>
                  )}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <UiFormField
                      label="DESCRIPTION"
                      errorText={errors.description?.message}
                    >
                      <UiInput
                        {...field}
                        placeholder="Brief description of this role's purpose"
                      />
                    </UiFormField>
                  )}
                />
              </Grid>
            </Grid>
          </Box>

          <Box>
            <Box
              sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}
            >
              <VpnKeyIcon color="primary" />
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 700, letterSpacing: '0.5px' }}
              >
                MODULE PERMISSIONS
              </Typography>
            </Box>

            <Controller
              name="permissions"
              control={control}
              render={({ field }) => (
                <RolePermissionMatrix
                  permissions={Permissions}
                  selectedPermissions={field.value}
                  onChange={field.onChange}
                  pagination={permissionsPagination}
                  onPaginationChange={onPermissionsPaginationChange}
                  loading={isPermissionsLoading}
                />
              )}
            />
          </Box>
          <UiFormActions
            onCancel={onCancel}
            cancelDisabled={isLoading}
            submitDisabled={isLoading || !isDirty || !isValid}
            loading={isLoading}
            submitLabel={submitLabel}
            leadingActions={
              isEdit && onDelete ? (
                <UiButton
                  type="button"
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={onDelete}
                >
                  Delete Role
                </UiButton>
              ) : undefined
            }
          />
        </Stack>
      </Card>
    </Box>
  );
};
