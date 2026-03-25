// cspell:ignore certbase usernamepassword
import { useCallback, useEffect, useMemo, useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import DeleteIcon from '@mui/icons-material/Delete';
import LanIcon from '@mui/icons-material/Lan';
import RouterIcon from '@mui/icons-material/Router';
import WifiTetheringIcon from '@mui/icons-material/WifiTethering';
import {
  Box,
  Card,
  Grid,
  MenuItem,
  Select,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form';
import * as yup from 'yup';

import { useToast } from '@libs/hooks';
import { AddIcon, tokens, UiBadge, UiButton, UiFormField, UiInput } from '@libs/ui';

import { TestConnectionStatus, type TestStatus } from '../constants';
import { useDeviceTestConnection } from '../hooks';
import { ProtocolSelect } from './ProtocolSelect';
import { UploadFiled } from './UploadFiled';

import type { CreateDevicePayload, DeviceAuthenticationType } from '../types';

const AUTH_OPTIONS: Array<{ label: string; value: DeviceAuthenticationType }> =
  [
    { label: 'Certificate-based', value: 'CERT_BASE' },
    { label: 'Username/Password', value: 'USERNAME_PASSWORD' },
  ];
const FUNCTION_TYPE_OPTIONS: Array<{ label: string; value: DeviceFunctionType }> =
  [
    { label: 'Configuration Management', value: 'CM' },
    { label: 'Performance Management', value: 'PM' },
  ];

const MAX_CERT_FILE_SIZE_KB = 100;
const ALLOWED_CERT_EXTENSIONS: Array<string> = ['.crt', '.cert', '.cer'];
const IPV4_REGEX = /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/;

type DeviceFunctionType = 'CM' | 'PM';

type ConnectionAction = 'UPDATE' | 'DELETE';

interface DeviceConnectionFormValues {
  connectionId?: number | string | null;
  action?: ConnectionAction | null;
  functionType: DeviceFunctionType;
  port: number;
  protocolId: number;
  authenticationType: DeviceAuthenticationType;
  username: string;
  password: string;
  clientCertificate: string;
}

interface DeviceFormValues {
  managementIp: string;
  connections: Array<DeviceConnectionFormValues>;
  deletedConnectionIds: Array<number | string>;
}

interface DeviceFormInitialValues extends Partial<CreateDevicePayload> {
  connections?: Array<Partial<DeviceConnectionFormValues>>;
}

type DeviceConnectionSeed = Partial<CreateDevicePayload> & {
  functionType?: DeviceFunctionType;
};

interface DeviceFormProps {
  initialValues?: DeviceFormInitialValues;
  onSubmit: (data: FormData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  submitLabel?: string;
  formId?: string;
  showFooterActions?: boolean;
  onFormStateChange?: (state: { isDirty: boolean; isValid: boolean }) => void;
}

const connectionSchema: yup.ObjectSchema<DeviceConnectionFormValues> = yup
  .object({
    connectionId: yup.mixed<number | string>().nullable().notRequired(),
    action: yup.mixed<ConnectionAction>().oneOf(['UPDATE', 'DELETE']).nullable().notRequired(),
    functionType: yup
      .mixed<DeviceFunctionType>()
      .oneOf(['CM', 'PM'])
      .required('Function Type is required'),
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
    username: yup
      .string()
      .default('')
      .when('authenticationType', {
        is: 'USERNAME_PASSWORD',
        then: (s) => s.required('Username is required'),
        otherwise: (s) => s,
      })
      .defined(),
    password: yup
      .string()
      .default('')
      .when('authenticationType', {
        is: 'USERNAME_PASSWORD',
        then: (s) =>
          s
            .required('Password is required')
            .min(3, 'Password must be at least 3 characters'),
        otherwise: (s) => s,
      })
      .defined(),
    clientCertificate: yup
      .string()
      .default('')
      .when('authenticationType', {
        is: 'CERT_BASE',
        then: (s) => s.required('Certificate file is required'),
        otherwise: (s) => s,
      })
      .defined(),
  })
  .required();

const schema: yup.ObjectSchema<DeviceFormValues> = yup
  .object({
    managementIp: yup
      .string()
      .required('Management IP is required')
      .matches(IPV4_REGEX, 'Invalid IPv4 address'),
    connections: yup
      .array()
      .of(connectionSchema)
      .min(1, 'At least one connection is required')
      .max(2, 'Each device supports up to 2 connections (CM + PM).')
      .test(
        'unique-function-type',
        'Each device can only have one CM and one PM connection.',
        (value) => {
          if (!value) return true;
          const types = value
            .map((v) => v?.functionType)
            .filter(Boolean) as Array<DeviceFunctionType>;
          return new Set(types).size === types.length;
        },
      )
      .required(),
    deletedConnectionIds: yup.array().of(yup.mixed<number | string>().required()).required(),
  })
  .required();

const createConnectionDefaults = (
  initialValues?: Partial<DeviceConnectionFormValues> | DeviceConnectionSeed,
): DeviceConnectionFormValues => ({
  connectionId:
    'connectionId' in (initialValues ?? {})
      ? (initialValues as Partial<DeviceConnectionFormValues>)?.connectionId ??
        null
      : null,
  functionType: initialValues?.functionType ?? 'CM',
  port: initialValues?.port ?? 443,
  protocolId: initialValues?.protocolId ?? 0,
  authenticationType:
    initialValues?.authenticationType ?? 'USERNAME_PASSWORD',
  username: initialValues?.username ?? '',
  password: initialValues?.password ?? '',
  clientCertificate: initialValues?.clientCertificate ?? '',
});

const buildDefaults = (
  initialValues?: DeviceFormInitialValues,
): DeviceFormValues => {
  const initialConnections =
    initialValues?.connections && initialValues.connections.length > 0
      ? initialValues.connections
      : [initialValues ?? {}];

  return {
    managementIp: initialValues?.managementIp ?? '',
    connections: initialConnections.map((connection) =>
      createConnectionDefaults(connection),
    ),
    deletedConnectionIds: [],
  };
};

const buildEmptyTestStates = (count: number) =>
  Array.from({ length: count }, () => ({
    status: TestConnectionStatus.NotTested as TestStatus,
    signature: '',
  }));

export const DeviceForm = ({
  initialValues,
  onSubmit,
  onCancel,
  isLoading,
  submitLabel = 'Add Device',
  formId,
  showFooterActions = true,
  onFormStateChange,
}: DeviceFormProps) => {
  const [connectionFiles, setConnectionFiles] = useState<Array<File | null>>([]);
  const [connectionTests, setConnectionTests] = useState<
    Array<{ status: TestStatus; signature: string }>
  >([]);
  const toast = useToast();

  const { mutateAsync: testConnection, isPending: isTestingConnection } =
    useDeviceTestConnection();

  const defaultValues = useMemo(
    () => buildDefaults(initialValues),
    [initialValues],
  );

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isDirty, isValid },
  } = useForm<DeviceFormValues>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'connections',
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  useEffect(() => {
    onFormStateChange?.({ isDirty, isValid });
  }, [isDirty, isValid, onFormStateChange]);

  const managementIp = useWatch({ control, name: 'managementIp' });
  const watchedConnections = useWatch({ control, name: 'connections' });
  const watchedDeletedConnectionIds = useWatch({
    control,
    name: 'deletedConnectionIds',
  });
  const connections = useMemo(
    () => watchedConnections ?? [],
    [watchedConnections],
  );
  const deletedConnectionIds = useMemo(
    () => watchedDeletedConnectionIds ?? [],
    [watchedDeletedConnectionIds],
  );

  const connectionSignatures = useMemo(
    () =>
      connections.map((connection) =>
        [
          managementIp,
          connection?.functionType,
          connection?.port,
          connection?.protocolId,
          connection?.authenticationType,
          connection?.username,
          connection?.password,
          connection?.clientCertificate,
        ]
          .map((value) => value ?? '')
          .join('|'),
      ),
    [connections, managementIp],
  );

  const resetAllTestStatuses = useCallback(() => {
    setConnectionTests(buildEmptyTestStates(fields.length || 1));
  }, [fields.length]);

  const resetConnectionTestStatus = useCallback(
    (index: number) => {
      setConnectionTests((current) => {
        const next =
          current.length === fields.length
            ? [...current]
            : buildEmptyTestStates(fields.length || 1);
        next[index] = {
          status: TestConnectionStatus.NotTested,
          signature: '',
        };
        return next;
      });
    },
    [fields.length],
  );

  const handleCertificateLoaded = useCallback(
    (
      index: number,
      payload: {
        file: File;
        fileName: string;
        content: string;
      },
    ) => {
      setConnectionFiles((current) => {
        const next = [...current];
        next[index] = payload.file;
        return next;
      });
      setValue(`connections.${index}.clientCertificate`, payload.content, {
        shouldDirty: true,
        shouldValidate: true,
      });
      resetConnectionTestStatus(index);
    },
    [resetConnectionTestStatus, setValue],
  );

  const handleCertificateInvalid = useCallback(
    (index: number, message: string) => {
      toast.error(message);
      setConnectionFiles((current) => {
        const next = [...current];
        next[index] = null;
        return next;
      });
      setValue(`connections.${index}.clientCertificate`, '', {
        shouldDirty: true,
        shouldValidate: true,
      });
      resetConnectionTestStatus(index);
    },
    [resetConnectionTestStatus, setValue, toast],
  );

  const handleAddConnection = () => {
    if (fields.length >= 2) return;

    const used = new Set(connections.map((c) => c?.functionType).filter(Boolean));
    const nextFunctionType: DeviceFunctionType = used.has('CM') ? 'PM' : 'CM';
    append(createConnectionDefaults({ functionType: nextFunctionType }));
    setConnectionFiles((current) => [...current, null]);
    setConnectionTests((current) => [
      ...current,
      {
        status: TestConnectionStatus.NotTested,
        signature: '',
      },
    ]);
  };

  const handleRemoveConnection = (index: number) => {
    if (fields.length === 1) return;

    const connectionId = connections[index]?.connectionId;
    if (connectionId !== undefined && connectionId !== null && connectionId !== '') {
      setValue(
        'deletedConnectionIds',
        [...deletedConnectionIds, connectionId],
        { shouldDirty: true },
      );
    }

    remove(index);
    setConnectionFiles((current) =>
      current.filter((_, itemIndex) => itemIndex !== index),
    );
    setConnectionTests((current) =>
      current.filter((_, itemIndex) => itemIndex !== index),
    );
  };

  const buildDeviceFormData = (
    payload: DeviceFormValues,
    options: {
      certificateFiles: Array<File | null>;
    },
  ) => {
    const formData = new FormData();
    const {
      managementIp: payloadManagementIp,
      connections: payloadConnections,
      deletedConnectionIds,
    } = payload;
    formData.append('managementIp', payloadManagementIp);

    payloadConnections.forEach((connection, index) => {
      const {
        connectionId,
        port,
        functionType,
        protocolId,
        authenticationType,
        username,
        password,
      } = connection;

      if (connectionId !== undefined && connectionId !== null && connectionId !== '') {
        formData.append(`connections[${index}].action`, 'UPDATE');
        formData.append(
          `connections[${index}].connectionId`,
          String(connectionId),
        );
      }

      formData.append(`connections[${index}].port`, String(port));
      formData.append(
        `connections[${index}].functionType`,
        functionType,
      );
      formData.append(
        `connections[${index}].protocolId`,
        String(protocolId),
      );
      formData.append(
        `connections[${index}].authenticationType`,
        authenticationType,
      );

      if (authenticationType === 'USERNAME_PASSWORD') {
        if (username) {
          formData.append(`connections[${index}].username`, username);
        }
        if (password) {
          formData.append(`connections[${index}].password`, password);
        }
      }

      if (
        authenticationType === 'CERT_BASE' &&
        options.certificateFiles[index]
      ) {
        formData.append(
          `connections[${index}].clientCertificate`,
          options.certificateFiles[index] as Blob,
        );
      }
    });

    deletedConnectionIds.forEach((connectionId, deleteIndex) => {
      const index = payloadConnections.length + deleteIndex;
      formData.append(`connections[${index}].action`, 'DELETE');
      formData.append(`connections[${index}].connectionId`, String(connectionId));
    });

    return formData;
  };

  const buildConnectionsTestFormData = (
    testConnections: Array<DeviceConnectionFormValues>,
    options: {
      certificateFiles: Array<File | null>;
    },
  ) => {
    const formData = new FormData();
    formData.append('managementIp', managementIp || '');

    testConnections.forEach((connection, index) => {
      const {
        port,
        functionType,
        protocolId,
        authenticationType,
        username,
        password,
      } = connection;

      formData.append(`connections[${index}].port`, String(port));
      formData.append(`connections[${index}].functionType`, functionType);
      formData.append(`connections[${index}].protocolId`, String(protocolId));
      formData.append(
        `connections[${index}].authenticationType`,
        authenticationType,
      );

      if (authenticationType === 'USERNAME_PASSWORD') {
        if (username) {
          formData.append(`connections[${index}].username`, username);
        }
        if (password) {
          formData.append(`connections[${index}].password`, password);
        }
      }

      if (
        authenticationType === 'CERT_BASE' &&
        options.certificateFiles[index]
      ) {
        formData.append(
          `connections[${index}].clientCertificate`,
          options.certificateFiles[index] as Blob,
        );
      }
    });

    return formData;
  };

  const handleTestConnection = async (index: number) => {
    const connection = connections[index];
    if (!connection) return;
    const {
      functionType,
      port,
      protocolId,
      authenticationType,
      username,
      password,
      clientCertificate,
    } = connection;

    const payload: DeviceConnectionFormValues = {
      connectionId: connection.connectionId ?? null,
      functionType,
      port: Number(port),
      protocolId: Number(protocolId),
      authenticationType,
      username: username ?? '',
      password: password ?? '',
      clientCertificate: clientCertificate ?? '',
    };

    const isRequiredFieldsMissing =
      !managementIp || !payload.port || !payload.protocolId;

    if (isRequiredFieldsMissing) {
      toast.error(
        'Please fill Management IP, Port and Protocol before testing.',
      );
      return;
    }

    if (
      payload.authenticationType === 'USERNAME_PASSWORD' &&
      (!payload.username || !payload.password)
    ) {
      toast.error('Please fill Username and Password before testing.');
      return;
    }

    if (
      payload.authenticationType === 'CERT_BASE' &&
      !payload.clientCertificate
    ) {
      toast.error('Please upload a certificate before testing.');
      return;
    }

    try {
      const formData = buildConnectionsTestFormData(
        [payload],
        { certificateFiles: [connectionFiles[index] ?? null] },
      );
      const response = await testConnection(formData);
      const resultStatus =
        response.data?.status?.value ?? TestConnectionStatus.OutOfService;
      const isInService = resultStatus === TestConnectionStatus.InService;

      if (isInService) {
        toast.success(response.message || 'Connection test successful');
      } else {
        toast.error(response.message || 'Connection test failed');
      }

      setConnectionTests((current) => {
        const next =
          current.length === fields.length
            ? [...current]
            : buildEmptyTestStates(fields.length || 1);
        next[index] = {
          status: resultStatus as TestStatus,
          signature: connectionSignatures[index] ?? '',
        };
        return next;
      });
    } catch {
      resetConnectionTestStatus(index);
    }
  };

  const handleFormSubmit = (data: DeviceFormValues) => {
    const payload: DeviceFormValues = {
      managementIp: data.managementIp,
      connections: data.connections.map((connection) => ({
        ...connection,
        port: Number(connection.port),
        protocolId: Number(connection.protocolId),
      })),
      deletedConnectionIds: data.deletedConnectionIds ?? [],
    };

    const formData = buildDeviceFormData(payload, {
      certificateFiles: connectionFiles,
    });

    onSubmit(formData);
  };

  return (
    <Box
      component="form"
      id={formId}
      onSubmit={handleSubmit(handleFormSubmit)}
    >
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
              <RouterIcon color="primary" />
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 700, letterSpacing: '0.5px' }}
              >
                DEVICE INFO
              </Typography>
            </Box>

            <Grid container spacing={4}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="managementIp"
                  control={control}
                  render={({ field }) => (
                    <UiFormField
                      label="MANAGEMENT IP"
                      required
                      errorText={errors.managementIp?.message}
                    >
                      <UiInput
                        {...field}
                        placeholder="Enter IP..."
                        onChange={(event) => {
                          field.onChange(event);
                          resetAllTestStatuses();
                        }}
                      />
                    </UiFormField>
                  )}
                />
              </Grid>
            </Grid>
          </Box>

          <Box>
            <Box
              sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}
            >
              <LanIcon color="primary" />
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 700, letterSpacing: '0.5px' }}
              >
                CONNECTION
              </Typography>
            </Box>

            <Stack spacing={2}>
              {fields.map((field, index) => {
                const connection = connections[index];
                const { authenticationType } = connection ?? {};
                const connectionErrors = errors.connections?.[index];
                const connectionTest = connectionTests[index];
                const connectionSignature = connectionSignatures[index] ?? '';
                const displayTestStatus =
                  connectionTest?.signature === connectionSignature
                    ? connectionTest?.status ?? TestConnectionStatus.NotTested
                    : TestConnectionStatus.NotTested;
                const statusLabel =
                  displayTestStatus === TestConnectionStatus.NotTested
                    ? 'Not Tested'
                    : displayTestStatus === TestConnectionStatus.InService
                      ? 'In Service'
                      : 'Out of Service';
                const isActive =
                  displayTestStatus === TestConnectionStatus.InService;
                const deleteConnectionDisabled =
                  fields.length === 1 || Boolean(isLoading);
                const deleteConnectionDisabledReason =
                  fields.length === 1
                    ? 'At least one connection is required.'
                    : isLoading
                      ? 'Please wait while the form is loading.'
                      : '';
                const isNotTested =
                  displayTestStatus === TestConnectionStatus.NotTested;

                return (
                  <Box
                    key={field.id}
                    sx={{
                      pt: index === 0 ? 0 : 2.5,
                      borderTop: index === 0 ? 'none' : '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: { xs: 'flex-start', md: 'center' },
                        gap: 2,
                        mb: 1.5,
                        flexWrap: 'wrap',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.5,
                          flexWrap: 'wrap',
                        }}
                      >
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                          Connection {index + 1}
                        </Typography>
                        <UiBadge
                          variant={
                            isNotTested
                              ? 'neutral'
                              : isActive
                                ? 'success'
                                : 'danger'
                          }
                          size="sm"
                          appearance="status"
                        >
                          {statusLabel}
                        </UiBadge>
                      </Box>

                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          flexWrap: 'wrap',
                          ml: 'auto',
                        }}
                      >
                        <UiButton
                          type="button"
                          variant="outlined"
                          size="sm"
                          startIcon={<WifiTetheringIcon />}
                          onClick={() => handleTestConnection(index)}
                          disabled={isTestingConnection}
                          loading={isTestingConnection}
                        >
                          Test Connection
                        </UiButton>
                        <Tooltip
                          title={deleteConnectionDisabledReason}
                          disableHoverListener={!deleteConnectionDisabled}
                          disableFocusListener={!deleteConnectionDisabled}
                          disableTouchListener={!deleteConnectionDisabled}
                        >
                          <span>
                            <UiButton
                              type="button"
                              variant="outlined"
                              color="error"
                              size="sm"
                              startIcon={<DeleteIcon />}
                              onClick={() => handleRemoveConnection(index)}
                              disabled={deleteConnectionDisabled}
                            >
                              Delete Connection
                            </UiButton>
                          </span>
                        </Tooltip>
                      </Box>
                    </Box>

                    <Box className="grid gap-3 md:grid-cols-12">
                      <Box className="md:col-span-3">
                        <Controller
                          name={`connections.${index}.protocolId`}
                          control={control}
                          render={({ field: connectionField }) => (
                            <ProtocolSelect
                              value={
                                connectionField.value
                                  ? Number(connectionField.value)
                                  : ''
                              }
                              onChange={connectionField.onChange}
                              errorText={connectionErrors?.protocolId?.message}
                              disabled={isLoading}
                              onResetTestStatus={() =>
                                resetConnectionTestStatus(index)
                              }
                            />
                          )}
                        />
                      </Box>

                      <Box className="md:col-span-3">
                        <Controller
                          name={`connections.${index}.port`}
                          control={control}
                          render={({ field: connectionField }) => (
                            <UiFormField
                              label="PORT"
                              required
                              errorText={connectionErrors?.port?.message}
                            >
                              <UiInput
                                {...connectionField}
                                type="number"
                                placeholder="443"
                                value={String(connectionField.value ?? '')}
                                onChange={(event) => {
                                  connectionField.onChange(
                                    Number(event.target.value),
                                  );
                                  resetConnectionTestStatus(index);
                                }}
                              />
                            </UiFormField>
                          )}
                        />
                      </Box>

                      <Box className="md:col-span-3">
                        <Controller
                          name={`connections.${index}.functionType`}
                          control={control}
                          render={({ field: connectionField }) => (
                            <UiFormField
                              label="FUNCTION TYPE"
                              required
                              errorText={connectionErrors?.functionType?.message}
                            >
                              <Select
                                {...connectionField}
                                value={connectionField.value || ''}
                                fullWidth
                                onChange={(event) => {
                                  connectionField.onChange(event);
                                  resetConnectionTestStatus(index);
                                }}
                              >
                                {FUNCTION_TYPE_OPTIONS.map((opt) => {
                                  const usedByOtherConnections = connections.some(
                                    (c, connectionIndex) =>
                                      connectionIndex !== index &&
                                      c?.functionType === opt.value,
                                  );
                                  return (
                                    <MenuItem
                                      key={opt.value}
                                      value={opt.value}
                                      disabled={usedByOtherConnections}
                                    >
                                      {opt.label}
                                    </MenuItem>
                                  );
                                })}
                              </Select>
                            </UiFormField>
                          )}
                        />
                      </Box>

                      <Box className="md:col-span-3">
                        <Controller
                          name={`connections.${index}.authenticationType`}
                          control={control}
                          render={({ field: connectionField }) => (
                            <UiFormField
                              label="AUTHENTICATION"
                              required
                              errorText={connectionErrors?.authenticationType?.message}
                            >
                              <Select
                                {...connectionField}
                                value={connectionField.value || ''}
                                fullWidth
                                onChange={(event) => {
                                  connectionField.onChange(event);
                                  resetConnectionTestStatus(index);
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
                      </Box>

                      {authenticationType === 'CERT_BASE' ? (
                        <Box className="md:col-span-12">
                          <UiFormField
                            label="CLIENT CERTIFICATE"
                            required
                            errorText={connectionErrors?.clientCertificate?.message}
                          >
                            <UploadFiled
                              acceptedExtensions={ALLOWED_CERT_EXTENSIONS}
                              maxFileSizeKb={MAX_CERT_FILE_SIZE_KB}
                              selectedFileName={
                                connectionFiles[index]?.name ||
                                connection?.clientCertificate ||
                                ''
                              }
                              onFileLoaded={(payload) =>
                                handleCertificateLoaded(index, payload)
                              }
                              onInvalidFile={(message) =>
                                handleCertificateInvalid(index, message)
                              }
                            />
                          </UiFormField>
                        </Box>
                      ) : (
                        <>
                          <Box className="md:col-span-6">
                            <Controller
                              name={`connections.${index}.username`}
                              control={control}
                              render={({ field: connectionField }) => (
                                <UiFormField
                                  label="USERNAME"
                                  required
                                  errorText={connectionErrors?.username?.message}
                                >
                                  <UiInput
                                    {...connectionField}
                                    placeholder="Enter username..."
                                    onChange={(event) => {
                                      connectionField.onChange(event);
                                      resetConnectionTestStatus(index);
                                    }}
                                  />
                                </UiFormField>
                              )}
                            />
                          </Box>

                          <Box className="md:col-span-6">
                            <Controller
                              name={`connections.${index}.password`}
                              control={control}
                              render={({ field: connectionField }) => (
                                <UiFormField
                                  label="PASSWORD"
                                  required
                                  errorText={connectionErrors?.password?.message}
                                >
                                  <UiInput
                                    {...connectionField}
                                    type="password"
                                    passwordToggle
                                    placeholder="Enter password..."
                                    onChange={(event) => {
                                      connectionField.onChange(event);
                                      resetConnectionTestStatus(index);
                                    }}
                                  />
                                </UiFormField>
                              )}
                            />
                          </Box>
                        </>
                      )}
                    </Box>
                  </Box>
                );
              })}

              <Box>
                <Tooltip
                  title={
                    fields.length >= 2
                      ? 'Maximum 2 connections (Configuration Management + Performance Management).'
                      : ''
                  }
                  disableHoverListener={fields.length < 2}
                  disableFocusListener={fields.length < 2}
                  disableTouchListener={fields.length < 2}
                >
                  <span>
                    <UiButton
                      type="button"
                      variant="outlined"
                      size="sm"
                      startIcon={<AddIcon />}
                      onClick={handleAddConnection}
                      disabled={Boolean(isLoading) || fields.length >= 2}
                    >
                      Add Connection
                    </UiButton>
                  </span>
                </Tooltip>
              </Box>
            </Stack>
          </Box>

          {showFooterActions ? (
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
              {onCancel ? (
                <UiButton
                  type="button"
                  variant="outlined"
                  onClick={onCancel}
                  disabled={isLoading}
                >
                  Cancel
                </UiButton>
              ) : null}
              <UiButton
                type="submit"
                variant="contained"
                disabled={isLoading || !isDirty || !isValid}
                loading={isLoading}
              >
                {submitLabel}
              </UiButton>
            </Box>
          ) : null}
        </Stack>
      </Card>
    </Box>
  );
};
