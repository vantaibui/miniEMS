// cspell:ignore certbase usernamepassword
import { yupResolver } from '@hookform/resolvers/yup';
import { useToast } from '@libs/hooks';
import { UiButton, UiFormField, UiInput } from '@libs/ui';
import CircleIcon from '@mui/icons-material/Circle';
import DnsIcon from '@mui/icons-material/Dns';
import HttpsIcon from '@mui/icons-material/Https';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import RouterIcon from '@mui/icons-material/Router';
import LanIcon from '@mui/icons-material/Lan';
import SecurityIcon from '@mui/icons-material/Security';
import { Box, Card, Grid, MenuItem, Select, Stack, Typography } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import * as yup from 'yup';

import { useDeviceTestConnection } from '../hooks';
import type { CreateDevicePayload, DeviceAuthenticationType } from '../types';
import { DeviceTestConnectionModal } from './DeviceTestConnectionModal';
import { ProtocolSelect } from './ProtocolSelect';
import { UploadFiled } from './UploadFiled';
import { TestConnectionStatus, type TestStatus } from '../constants';

const AUTH_OPTIONS: Array<{ label: string; value: DeviceAuthenticationType }> = [
  { label: 'Certificate-based', value: 'CERT_BASE' },
  { label: 'Username/Password', value: 'USERNAME_PASSWORD' },
];

const MAX_CERT_FILE_SIZE_KB = 100;
const ALLOWED_CERT_EXTENSIONS: Array<string> = ['.crt', '.cert'];

const schema: yup.ObjectSchema<CreateDevicePayload> = yup
  .object({
    managementIp: yup
      .string()
      .required('Management IP is required')
      .matches(
        /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/,
        'Invalid IPv4 address',
      ),
    port: yup
      .number()
      .typeError('Port must be a number')
      .required('Port is required')
      .integer('Port must be an integer')
      .min(1)
      .max(65535),
    protocolId: yup
      .number()
      .typeError('Protocol is required')
      .required('Protocol is required')
      .integer('Protocol must be valid')
      .min(1),
    authenticationType: yup
      .mixed<DeviceAuthenticationType>()
      .oneOf(['CERT_BASE', 'USERNAME_PASSWORD'])
      .required('Authentication type is required'),
    username: yup.string().when('authenticationType', {
      is: 'USERNAME_PASSWORD',
      then: (s) => s.required('Username is required'),
      otherwise: (s) => s.optional(),
    }),
    password: yup.string().when('authenticationType', {
      is: 'USERNAME_PASSWORD',
      then: (s) => s.required('Password is required').min(6),
      otherwise: (s) => s.optional(),
    }),
    clientCertificate: yup.string().when('authenticationType', {
      is: 'CERT_BASE',
      then: (s) => s.required('Certificate file is required'),
      otherwise: (s) => s.optional(),
    }),
  })
  .required();

interface DeviceFormProps {
  initialValues?: Partial<CreateDevicePayload>;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  submitLabel?: string;
}

const buildDefaults = (initialValues?: Partial<CreateDevicePayload>): CreateDevicePayload => ({
  managementIp: initialValues?.managementIp ?? '',
  port: initialValues?.port ?? 443,
  protocolId: initialValues?.protocolId ?? 0,
  authenticationType: initialValues?.authenticationType ?? 'USERNAME_PASSWORD',
  username: initialValues?.username ?? '',
  password: initialValues?.password ?? '',
  clientCertificate: initialValues?.clientCertificate ?? '',
});

export const DeviceForm = ({
  initialValues,
  onSubmit,
  onCancel,
  isLoading,
  submitLabel = 'Add Device',
}: DeviceFormProps) => {
  const [certificateFileName, setCertificateFileName] = useState('');
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [isTestConnectionModalOpen, setIsTestConnectionModalOpen] = useState(false);
  const [lastTestStatus, setLastTestStatus] = useState<TestStatus>(TestConnectionStatus.OutOfService);
  const [lastTestSignature, setLastTestSignature] = useState('');
  const [selectedProtocolDisplay, setSelectedProtocolDisplay] = useState('');
  const toast = useToast();

  const resetTestStatus = useCallback(() => {
    setLastTestStatus(TestConnectionStatus.OutOfService);
    setLastTestSignature('');
  }, []);
  const { mutateAsync: testConnection, isPending: isTestingConnection } = useDeviceTestConnection();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isDirty, isValid },
  } = useForm<CreateDevicePayload>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: buildDefaults(initialValues),
  });

  const defaultValues = useMemo(() => buildDefaults(initialValues), [initialValues]);

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const authenticationType = useWatch({ control, name: 'authenticationType' });
  const hasInitialCertificate = Boolean(initialValues?.clientCertificate);
  const managementIp = useWatch({ control, name: 'managementIp' });
  const port = useWatch({ control, name: 'port' });
  const protocolId = useWatch({ control, name: 'protocolId' });
  const username = useWatch({ control, name: 'username' });
  const password = useWatch({ control, name: 'password' });
  const clientCertificate = useWatch({ control, name: 'clientCertificate' });

  const testSignature = useMemo(
    () =>
      [
        managementIp,
        port,
        protocolId,
        authenticationType,
        username,
        password,
        clientCertificate,
      ]
        .map((value) => value ?? '')
        .join('|'),
    [
      managementIp,
      port,
      protocolId,
      authenticationType,
      username,
      password,
      clientCertificate,
    ],
  );

  const displayTestStatus = useMemo(
    () =>
      testSignature === lastTestSignature
        ? lastTestStatus
        : TestConnectionStatus.OutOfService,
    [testSignature, lastTestSignature, lastTestStatus],
  );

  const clearCertificate = useCallback(() => {
    if (!certificateFile && !certificateFileName && !clientCertificate) return;
    setCertificateFile(null);
    setCertificateFileName('');
    setValue('clientCertificate', '', { shouldDirty: true, shouldValidate: true });
  }, [certificateFile, certificateFileName, clientCertificate, setValue]);

  const handleCertificateLoaded = ({
    file,
    fileName,
    content,
  }: {
    file: File;
    fileName: string;
    content: string;
  }) => {
    setCertificateFile(file);
    setCertificateFileName(fileName);
    setValue('clientCertificate', content, { shouldDirty: true, shouldValidate: true });
    resetTestStatus();
  };

  const handleCertificateInvalid = (message: string) => {
    toast.error(message);
    clearCertificate();
    resetTestStatus();
  };

  const displayedCertificateName =
    certificateFileName || (hasInitialCertificate ? initialValues?.clientCertificate || '' : '');

  const buildDeviceFormData = (
    payload: CreateDevicePayload,
    options: {
      includeCertificate: boolean;
      certificateFile?: File | null;
    },
  ) => {
    const formData = new FormData();
    formData.append('managementIp', payload.managementIp);
    formData.append('port', String(payload.port));
    formData.append('protocolId', String(payload.protocolId));
    formData.append('authenticationType', payload.authenticationType);

    if (payload.authenticationType === 'USERNAME_PASSWORD') {
      if (payload.username) formData.append('username', payload.username);
      if (payload.password) formData.append('password', payload.password);
    }

    if (payload.authenticationType === 'CERT_BASE' && options.includeCertificate) {
      if (options.certificateFile) {
        formData.append('clientCertificate', options.certificateFile);
      }
    }

    return formData;
  };

  const handleTestConnection = async () => {
    const payload = {
      managementIp: managementIp || '',
      authenticationType,
      port: Number(port),
      protocolId: Number(protocolId),
      username,
      password,
      clientCertificate,
    } as CreateDevicePayload;

    if (!payload.managementIp || !payload.port || !payload.protocolId) {
      toast.error('Please fill Management IP, Port and Protocol before testing.');
      return TestConnectionStatus.OutOfService;
    }

    const formData = buildDeviceFormData(payload, {
      includeCertificate: payload.authenticationType === 'CERT_BASE',
      certificateFile,
    });

    try {
      const response = await testConnection(formData);
      const nextStatus = (response.data as { status?: { value?: string } } | undefined)?.status?.value ?? TestConnectionStatus.OutOfService;

      if (response.success) {
        toast.success(response.message || 'Connection test successful');
      } else {
        toast.error(response.message || 'Connection test failed');
      }

      setLastTestSignature(testSignature);
      setLastTestStatus(nextStatus as TestStatus);
      return nextStatus as TestStatus;
    } catch {
      return TestConnectionStatus.OutOfService;
    }
  };

  const handleFormSubmit = (data: CreateDevicePayload) => {
    const payload = {
      managementIp: data.managementIp,
      authenticationType: data.authenticationType,
      port: Number(data.port),
      protocolId: Number(data.protocolId),
      username: data.username,
      password: data.password,
      clientCertificate: data.clientCertificate,
    } as CreateDevicePayload;

    const formData = buildDeviceFormData(payload, {
      includeCertificate: payload.authenticationType === 'CERT_BASE' && Boolean(certificateFile),
      certificateFile,
    });

    onSubmit(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)}>
      <Card sx={{ p: { xs: 3, md: 5 }, borderRadius: 3, boxShadow: '0px 2px 10px rgba(0,0,0,0.05)' }}>
        <Stack spacing={4}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <RouterIcon color="primary" />
              <Typography variant="subtitle1" sx={{ fontWeight: 700, letterSpacing: '0.5px' }}>
                DEVICE INFO
              </Typography>
            </Box>

            <Grid container spacing={4}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="managementIp"
                  control={control}
                  render={({ field }) => (
                    <UiFormField label="MANAGEMENT IP" required errorText={errors.managementIp?.message}>
                      <UiInput
                        {...field}
                        placeholder="Enter IP..."
                        onChange={(event) => {
                          field.onChange(event);
                          resetTestStatus();
                        }}
                        startAdornment={<DnsIcon sx={{ color: 'text.secondary', fontSize: 20 }} />}
                      />
                    </UiFormField>
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="port"
                  control={control}
                  render={({ field }) => (
                    <UiFormField label="PORT" required errorText={errors.port?.message}>
                      <UiInput
                        {...field}
                        type="number"
                        placeholder="443"
                        value={String(field.value ?? '')}
                        onChange={(event) => {
                          field.onChange(Number(event.target.value));
                          resetTestStatus();
                        }}
                        startAdornment={<RouterIcon sx={{ color: 'text.secondary', fontSize: 20 }} />}
                      />
                    </UiFormField>
                  )}
                />
              </Grid>
            </Grid>
          </Box>

          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <SecurityIcon color="primary" />
              <Typography variant="subtitle1" sx={{ fontWeight: 700, letterSpacing: '0.5px' }}>
                ACCESS CONFIGURATION
              </Typography>
            </Box>

            <Grid container spacing={4}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="protocolId"
                  control={control}
                  render={({ field }) => (
                    <ProtocolSelect
                      value={field.value ? Number(field.value) : ''}
                      onChange={field.onChange}
                      errorText={errors.protocolId?.message}
                      disabled={isLoading}
                      onResetTestStatus={resetTestStatus}
                      onDisplayChange={setSelectedProtocolDisplay}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="authenticationType"
                  control={control}
                  render={({ field }) => (
                    <UiFormField label="AUTHENTICATION" required errorText={errors.authenticationType?.message}>
                      <Select
                        {...field}
                        value={field.value || ''}
                        fullWidth
                        onChange={(event) => {
                          field.onChange(event);
                          resetTestStatus();
                        }}
                      >
                        {AUTH_OPTIONS.map((opt) => (
                          <MenuItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </UiFormField>
                  )}
                />
              </Grid>

              {authenticationType === 'CERT_BASE' ? (
                <Grid size={{md: 12 }}>
                  <UiFormField
                    label="CLIENT CERTIFICATE"
                    required
                    errorText={errors.clientCertificate?.message}
                  >
                    <UploadFiled
                      acceptedExtensions={ALLOWED_CERT_EXTENSIONS}
                      maxFileSizeKb={MAX_CERT_FILE_SIZE_KB}
                      selectedFileName={displayedCertificateName}
                      onFileLoaded={handleCertificateLoaded}
                      onInvalidFile={handleCertificateInvalid}
                    />
                  </UiFormField>
                </Grid>
              ) : (
                <>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Controller
                      name="username"
                      control={control}
                      render={({ field }) => (
                        <UiFormField label="USERNAME" required errorText={errors.username?.message}>
                          <UiInput
                            {...field}
                            placeholder="Enter username..."
                            onChange={(event) => {
                              field.onChange(event);
                              resetTestStatus();
                            }}
                            startAdornment={<LockPersonIcon sx={{ color: 'text.secondary', fontSize: 20 }} />}
                          />
                        </UiFormField>
                      )}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <Controller
                      name="password"
                      control={control}
                      render={({ field }) => (
                        <UiFormField label="PASSWORD" required errorText={errors.password?.message}>
                          <UiInput
                            {...field}
                            type="password"
                            passwordToggle
                            placeholder="Enter password..."
                            onChange={(event) => {
                              field.onChange(event);
                              resetTestStatus();
                            }}
                            startAdornment={<HttpsIcon sx={{ color: 'text.secondary', fontSize: 20 }} />}
                          />
                        </UiFormField>
                      )}
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </Box>

          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <LanIcon color="primary" />
              <Typography variant="subtitle1" sx={{ fontWeight: 700, letterSpacing: '0.5px' }}>
                CONNECTION
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography variant="body2" color="text.secondary">
                Connection Status:
              </Typography>
              <CircleIcon
                sx={{
                  fontSize: 10,
                  color:
                    displayTestStatus === TestConnectionStatus.InService
                      ? '#16A34A'
                      : '#DC2626',
                }}
              />
              <Typography variant="body2" color="text.primary">
                {displayTestStatus === TestConnectionStatus.InService
                  ? 'In Service'
                  : 'Out of Service'}
              </Typography>
              <UiButton
                type="button"
                variant="outlined"
                sx={{ ml: 2 }}
                onClick={() => setIsTestConnectionModalOpen(true)}
                disabled={!isValid}
              >
                Test Connection
              </UiButton>
            </Box>
          </Box>

          <Box
            sx={{
              borderTop: '1px solid',
              borderColor: 'divider',
              pt: 3,
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2,
            }}
          >
            <UiButton type="button" variant="outlined" onClick={onCancel} disabled={isLoading}>
              Cancel
            </UiButton>
            <UiButton type="submit" variant="contained" disabled={isLoading || !isDirty || !isValid} loading={isLoading}>
              {submitLabel}
            </UiButton>
          </Box>
        </Stack>
      </Card>
      <DeviceTestConnectionModal
        open={isTestConnectionModalOpen}
        onClose={() => setIsTestConnectionModalOpen(false)}
        onStart={handleTestConnection}
        onStatusChange={setLastTestStatus}
        isStarting={isTestingConnection}
        data={{
          name: 'Device connection test',
          serialNumber: '-',
          ip: managementIp || '-',
          port: port ? String(port) : '-',
          protocol: selectedProtocolDisplay || (protocolId ? String(protocolId) : '-'),
          authenticationType:
            authenticationType === 'CERT_BASE' ? 'Certificate-based' : 'Username/Password',
          username: authenticationType === 'USERNAME_PASSWORD' ? username || '-' : undefined,
          certificate: authenticationType === 'CERT_BASE' ? certificateFileName || '-' : undefined,
        }}
      />
    </Box>
  );
};
