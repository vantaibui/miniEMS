import { yupResolver } from '@hookform/resolvers/yup';
import { DeleteIcon, UiButton, UiFormField, UiInput } from '@libs/ui';
import { Box, Card, IconButton, MenuItem, Select, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useState } from 'react';
import * as yup from 'yup';

import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PersonIcon from '@mui/icons-material/Person';
import SecurityIcon from '@mui/icons-material/Security';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import ShieldIcon from '@mui/icons-material/Shield';

import type { PaginationResult } from '@services/http';
import { RolePermissionMatrix } from '../../roles/components/RolePermissionMatrix';
import {
  usePermissions,
  usePermissionsById,
  useRoles,
} from '../../roles/hooks';
import type { PermissionNode } from '../../roles/types';
import type { CreateUserPayload } from '../types';

const createSchema = (isEdit: boolean) =>
  yup.object().shape({
    firstName: yup.string().required('First name is required').min(2).max(100),
    lastName: yup.string().required('Last name is required').min(2).max(100),
    username: yup.string().required('Username is required').min(2).max(100),
    email: yup
      .string()
      .email('Invalid email address')
      .required('Email is required'),
    password: isEdit
      ? yup.string()
      : yup
          .string()
          .required('Password is required')
          .min(6, 'Password must be at least 6 characters'),
    roleId: yup.number().required('Security role is required'),
  });

interface UserFormProps {
  initialValues?: {
    firstName?: string;
    lastName?: string;
    username?: string;
    email: string;
    roleId?: number;
  };
  onSubmit: (data: CreateUserPayload) => void;
  onCancel: () => void;
  onDelete?: () => void;
  isLoading?: boolean;
  submitLabel?: string;
  isEdit?: boolean;
  pagination?: PaginationResult;
  onPaginationChange?: (next: { page: number; size: number }) => void;
  isPermissionsLoading?: boolean;
}

export const UserForm = ({
  initialValues,
  onSubmit,
  onCancel,
  onDelete,
  isLoading,
  submitLabel = 'Save User',
  isEdit = false,
  pagination,
  onPaginationChange,
  isPermissionsLoading,
}: UserFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const { data: rolesResponse } = useRoles();
  const roles = rolesResponse?.items || [];

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm<CreateUserPayload>({
    resolver: yupResolver(createSchema(isEdit)) as never,
    mode: 'onChange',
    defaultValues: initialValues || {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: 'Passw0rd!',
      roleId: undefined,
    },
  });

  const selectedRoleId = useWatch({
    control,
    name: 'roleId',
  });
  const { data: permissionsRes } = usePermissions({
    page: pagination?.page,
    size: pagination?.size,
  });
  const Permissions = permissionsRes?.items || [];

  const { data: rolePermissionsRes } = usePermissionsById(selectedRoleId);
  const rolePermissions = rolePermissionsRes?.items || [];

  const extractAllocatedPermissions = (
    modules: Array<PermissionNode>,
  ): Array<{
    id: number;
    actions: {
      create: boolean;
      read: boolean;
      update: boolean;
      delete: boolean;
    };
  }> => {
    return modules
      .filter(
        (module) =>
          module.actions &&
          (module.actions.create ||
            module.actions.read ||
            module.actions.update ||
            module.actions.delete),
      )
      .map((module) => ({
        id: module.id,
        actions: {
          create: module.actions.create,
          read: module.actions.read,
          update: module.actions.update,
          delete: module.actions.delete,
        },
      }));
  };

  const handleFormSubmit = (
    data: CreateUserPayload,
  ) => {
    const payload: CreateUserPayload = {
      username: data.username,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      roleId: data.roleId,
      password: isEdit ? '' : (data.password || ''),
    };

    onSubmit(payload);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)}>
      <Card
        sx={{
          p: { xs: 3, md: 5 },
          borderRadius: 3,
          boxShadow: '0px 2px 10px rgba(0,0,0,0.05)',
        }}
      >
        <Stack spacing={4}>
          <Box>
            <Box
              sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}
            >
              <PersonIcon color="primary" />
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 700, letterSpacing: '0.5px' }}
              >
                BASIC INFORMATION
              </Typography>
            </Box>

            <Grid container spacing={4}>
              <Grid size={{ xs: 6 }}>
                <Controller
                  name="firstName"
                  control={control}
                  render={({ field }) => (
                    <UiFormField
                      label="FIRST NAME"
                      errorText={errors.firstName?.message}
                      required
                    >
                      <UiInput
                        {...field}
                        placeholder="e.g. Alex"
                        startAdornment={
                          <PersonIcon
                            sx={{ color: 'text.secondary', fontSize: 20 }}
                          />
                        }
                      />
                    </UiFormField>
                  )}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Controller
                  name="lastName"
                  control={control}
                  render={({ field }) => (
                    <UiFormField
                      label="LAST NAME"
                      errorText={errors.lastName?.message}
                      required
                    >
                      <UiInput
                        {...field}
                        placeholder="e.g. Rivers"
                        startAdornment={
                          <PersonIcon
                            sx={{ color: 'text.secondary', fontSize: 20 }}
                          />
                        }
                      />
                    </UiFormField>
                  )}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Controller
                  name="username"
                  control={control}
                  render={({ field }) => (
                    <UiFormField
                      label="USERNAME"
                      errorText={errors.username?.message}
                      required
                    >
                      <UiInput
                        {...field}
                        placeholder="e.g. alex.rivers"
                        startAdornment={
                          <AssignmentIndIcon
                            sx={{ color: 'text.secondary', fontSize: 20 }}
                          />
                        }
                      />
                    </UiFormField>
                  )}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <UiFormField
                      label="CORPORATE EMAIL ADDRESS"
                      errorText={errors.email?.message}
                      required
                    >
                      <UiInput
                        {...field}
                        placeholder="your-email@com.vn"
                        type="email"
                        startAdornment={
                          <MailOutlineIcon
                            sx={{ color: 'text.secondary', fontSize: 20 }}
                          />
                        }
                      />
                    </UiFormField>
                  )}
                />
              </Grid>
              {!isEdit && (
                <Grid size={{ xs: 6 }}>
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <UiFormField
                        label="PASSWORD"
                        errorText={errors.password?.message}
                        required
                      >
                        <UiInput
                          {...field}
                          placeholder="Enter password"
                          type={showPassword ? 'text' : 'password'}
                          startAdornment={
                            <VpnKeyIcon
                              sx={{ color: 'text.secondary', fontSize: 20 }}
                            />
                          }
                          endAdornment={
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              sx={{ color: 'text.secondary' }}
                            >
                              {showPassword ? (
                                <VisibilityOffIcon fontSize="small" />
                              ) : (
                                <VisibilityIcon fontSize="small" />
                              )}
                            </IconButton>
                          }
                        />
                      </UiFormField>
                    )}
                  />
                </Grid>
              )}
            </Grid>
          </Box>

          <Box>
            <Box
              sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}
            >
              <SecurityIcon color="primary" />
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 700, letterSpacing: '0.5px' }}
              >
                ACCESS LEVEL
              </Typography>
            </Box>
            <Grid container spacing={4}>
              <Grid size={{ xs: 6 }}>
                <Controller
                  name="roleId"
                  control={control}
                  render={({ field }) => (
                    <UiFormField
                      label="SECURITY ROLE"
                      errorText={errors.roleId?.message}
                      required
                    >
                      <Select
                        {...field}
                        value={field.value || ''}
                        displayEmpty
                        size="small"
                        fullWidth
                        sx={{
                          borderRadius: 2,
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'divider',
                          },
                          '& .MuiSelect-select': {
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            p: 1.5,
                          },
                        }}
                      >
                        <MenuItem disabled value="">
                          <span style={{ color: '#6b7280' }}>
                            <ShieldIcon
                              fontSize="small"
                              sx={{ mr: 1, verticalAlign: 'middle' }}
                            />{' '}
                            Choose Security Role
                          </span>
                        </MenuItem>
                        {roles.map((role) => (
                          <MenuItem key={role.id} value={role.id}>
                            <ShieldIcon
                              fontSize="small"
                              sx={{
                                mr: 1,
                                color: 'text.secondary',
                                verticalAlign: 'middle',
                              }}
                            />{' '}
                            {role.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </UiFormField>
                  )}
                />
              </Grid>
            </Grid>
          </Box>

          {selectedRoleId && (
            <Box>
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}
              >
                <VpnKeyIcon color="primary" />
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 700, letterSpacing: '0.5px' }}
                >
                  MODULE ACCESS
                </Typography>
              </Box>

              <RolePermissionMatrix
                permissions={Permissions}
                selectedPermissions={extractAllocatedPermissions(
                  rolePermissions,
                )}
                onChange={() => {}} // Read-only via readOnly prop
                readOnly={true}
                pagination={pagination}
                onPaginationChange={onPaginationChange}
                loading={isPermissionsLoading}
              />
            </Box>
          )}

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 4,
              pt: 3,
              borderTop: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Box>
              {isEdit && onDelete && (
                <UiButton
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={onDelete}
                  sx={{
                    fontWeight: 600,
                    px: 2,
                    borderColor: 'error.light',
                    '&:hover': { bgcolor: 'error.50' },
                  }}
                >
                  Delete Role
                </UiButton>
              )}
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <UiButton
                type="button"
                variant="outlined"
                onClick={onCancel}
                disabled={isLoading}
                sx={{
                  px: 3,
                  fontWeight: 600,
                  color: 'text.primary',
                  borderColor: 'divider',
                }}
              >
                Cancel
              </UiButton>
              <UiButton
                type="submit"
                variant="contained"
                disabled={isLoading || !isDirty || !isValid}
                loading={isLoading}
                sx={{
                  px: 3,
                  fontWeight: 600,
                  '&.Mui-disabled': {
                    bgcolor: 'primary.main',
                    color: 'common.white',
                    opacity: 0.5,
                  },
                }}
              >
                {submitLabel}
              </UiButton>
            </Box>
          </Box>
        </Stack>
      </Card>
    </Box>
  );
};
