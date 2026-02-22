import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Typography, Stack, Card, Select, MenuItem } from '@mui/material';
import Grid from '@mui/material/Grid';
import { UiInput, UiFormField, UiButton } from '@libs/ui';

import PersonIcon from '@mui/icons-material/Person';
import SecurityIcon from '@mui/icons-material/Security';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import BusinessIcon from '@mui/icons-material/Business';
import ShieldIcon from '@mui/icons-material/Shield';

import type { CreateUserPayload } from '../types';
import { RolePermissionMatrix } from '../../roles/components/RolePermissionMatrix';
import {
  useRoles,
  useRolePermissions,
  useAllPermissions,
} from '../../roles/hooks';
import type { PermissionNode } from '../../roles/types';

const schema = yup.object().shape({
  firstName: yup.string().required('First name is required').min(2).max(100),
  lastName: yup.string().required('Last name is required').min(2).max(100),
  username: yup.string().required('Username is required').min(2).max(100),
  email: yup
    .string()
    .email('Invalid email address')
    .required('Email is required'),
  department: yup.string(),
  roleId: yup.number().required('Security role is required'),
});

interface UserFormProps {
  initialValues?: {
    firstName?: string;
    lastName?: string;
    username?: string;
    email: string;
    department?: string;
    roleId?: number;
  };
  onSubmit: (data: CreateUserPayload) => void;
  onCancel: () => void;
  onDeactivate?: () => void;
  isLoading?: boolean;
  submitLabel?: string;
  isEdit?: boolean;
}

export const UserForm = ({
  initialValues,
  onSubmit,
  onCancel,
  onDeactivate,
  isLoading,
  submitLabel = 'Save User',
  isEdit = false,
}: UserFormProps) => {
  const { data: roles = [] } = useRoles();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema) as any,
    defaultValues: initialValues || {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      department: 'it',
      roleId: undefined,
    },
  });

  const selectedRoleId = watch('roleId');
  const { data: allPermissions = [] } = useAllPermissions();
  const { data: rolePermissions = [] } = useRolePermissions(selectedRoleId);

  const extractAllocatedPermissions = (
    nodes: PermissionNode[],
  ): Array<{
    id: number;
    actions: {
      create: boolean;
      read: boolean;
      update: boolean;
      delete: boolean;
    };
  }> => {
    let result: Array<{
      id: number;
      actions: {
        create: boolean;
        read: boolean;
        update: boolean;
        delete: boolean;
      };
    }> = [];
    nodes.forEach((node) => {
      if (
        node.actions &&
        (node.actions.canCreate ||
          node.actions.canRead ||
          node.actions.canUpdate ||
          node.actions.canDelete)
      ) {
        result.push({
          id: node.id,
          actions: {
            create: node.actions.canCreate,
            read: node.actions.canRead,
            update: node.actions.canUpdate,
            delete: node.actions.canDelete,
          },
        });
      }
      if (node.children && node.children.length > 0) {
        result = [...result, ...extractAllocatedPermissions(node.children)];
      }
    });
    return result;
  };

  const handleFormSubmit = (data: any) => {
    onSubmit({
      username: data.username,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      department: data.department,
      roleId: data.roleId,
    });
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
                permissions={allPermissions}
                selectedPermissions={extractAllocatedPermissions(
                  rolePermissions,
                )}
                onChange={() => {}} // Read-only via readOnly prop
                readOnly={true}
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
              {isEdit && onDeactivate && (
                <UiButton
                  type="button"
                  variant="outlined"
                  color="error"
                  startIcon={<PersonOffIcon />}
                  onClick={onDeactivate}
                  sx={{
                    fontWeight: 600,
                    px: 2,
                    color: 'error.main',
                    borderColor: 'error.light',
                    '&:hover': { bgcolor: 'error.50' },
                  }}
                >
                  Deactivate User
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
                disabled={isLoading}
                loading={isLoading}
                sx={{
                  px: 3,
                  fontWeight: 600,
                  boxShadow: '0px 4px 12px rgba(11, 87, 208, 0.2)',
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
