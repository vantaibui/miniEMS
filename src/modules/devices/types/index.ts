// cspell:ignore asic asiccount
export interface DisplayValue<T = string> {
  display: string;
  value: T;
}

export interface Device {
  id: number;
  name: string;
  serialNumber: string;
  managementIp: string;
  model: string;
  status: DisplayValue<string>;
  lastModifiedDate?: string | null;
}

export type DeviceAuthenticationType = 'CERT_BASE' | 'USERNAME_PASSWORD';

export interface DeviceConnection {
  id: number | null;
  port: number;
  caCert?: string | null;
  thumbprint?: string | null;
  protocol?: string | null;
  lastModifiedDate?: string | null;
}

export interface Protocol {
  id: number;
  name: string;
  description?: string | null;
  lastModifiedDate?: string | null;
}

export interface Credential {
  id: number | null;
  authenticationType: DeviceAuthenticationType;
  username?: string | null;
  password?: string | null;
  clientCertificate?: string | null;
  lastModifiedDate?: string | null;
}

export interface DeviceInfo {
  id: number;
  name?: string | null;
  model?: string | null;
  managementIp?: string | null;
  serialNumber?: string | null;
  macAddress?: string | null;
  status?: DisplayValue<string> | null;
  deviceType?: DisplayValue<string> | null;
  osType?: DisplayValue<string> | null;
  osVersion?: string | null;
  distribution?: string | null;
  kernel?: string | null;
  buildCommit?: string | null;
  buildDate?: string | null;
  builtBy?: string | null;
  platform?: string | null;
  hwSku?: string | null;
  asicType?: string | null;
  asicCount?: number | null;
  hardwareRevision?: string | null;
  uptime?: number | null;
}

// API Response structure - use directly from API
export interface DeviceDetail {
  device: DeviceInfo;
  connection: DeviceConnection;
  protocol: Protocol;
  credential: Credential;
  lastModifiedDate: string;
}

export interface CreateDevicePayload {
  managementIp: string;
  authenticationType: DeviceAuthenticationType;
  port: number;
  protocolId: number;
  username?: string;
  password?: string;
  clientCertificate?: string;
}

export type UpdateDevicePayload = CreateDevicePayload;

export interface DeviceTestConnectionResult {
  status?: {
    display?: string;
    value?: string;
  };
  message?: string;
  details?: string;
}
