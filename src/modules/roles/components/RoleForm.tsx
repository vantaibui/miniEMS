import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Typography, Stack, Card, Grid } from '@mui/material';
import { UiInput, UiFormField, UiButton } from '@libs/ui';

import SecurityIcon from '@mui/icons-material/Security';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import DescriptionIcon from '@mui/icons-material/Description';
import DeleteIcon from '@mui/icons-material/Delete';

import type { CreateRolePayload, PermissionNode } from '../types';
import { RolePermissionMatrix } from './RolePermissionMatrix';

const schema = yup.object().shape({
  name: yup.string().required('Role name is required').min(2).max(50),
  description: yup.string().required('Description is required'),
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
}: RoleFormProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateRolePayload>({
    resolver: yupResolver(schema) as never,
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
                      <UiInput
                        {...field}
                        placeholder="e.g. Regional Manager"
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
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <UiFormField
                      label="DESCRIPTION"
                      errorText={errors.description?.message}
                      required
                    >
                      <UiInput
                        {...field}
                        placeholder="Brief description of this role's purpose"
                        startAdornment={
                          <DescriptionIcon
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
                />
              )}
            />
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 4,
            }}
          >
            <Box>
              {isEdit && onDelete && (
                <UiButton
                  variant="text"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={onDelete}
                  sx={{ fontWeight: 600, px: 2 }}
                >
                  Delete Role
                </UiButton>
              )}
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <UiButton
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
