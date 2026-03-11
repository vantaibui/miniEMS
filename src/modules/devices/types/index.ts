// cspell:ignore asic asiccount
export type DeviceStatus = 'Active' | 'Inactive';

export interface Device {
  id: number;
  name: string;
  serialNumber: string;
  ip: string;
  model: string;
  status: DeviceStatus;
  lastUpdate: string;
}

export type DeviceAuthenticationType = 'CERT_BASE' | 'USERNAME_PASSWORD';

export interface DeviceDetail extends Device {
  soNicSoftwareVersion: string;
  distribution: string;
  kernel: string;
  buildCommit: string;
  buildDate: string;
  builtBy: string;
  platform: string;
  hwSKU: string;
  asic: string;
  asicCount: number;
  hardwareRev: string;
  uptime: string;
  managementIp?: string;
  port?: number;
  protocolId?: number;
  authenticationType?: DeviceAuthenticationType;
  username?: string;
  password?: string;
  clientCertificate?: string;
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
  connected: boolean;
  message?: string;
  details?: string;
}
