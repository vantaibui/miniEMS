export type DeviceStatus = 'ACTIVE' | 'INACTIVE';

export interface Device {
  id: number;
  name: string;
  serialNumber: string;
  status: DeviceStatus;
  model?: string;
  location?: string;
  lastSeenAt?: string;
}

export interface CreateDevicePayload {
  name: string;
  serialNumber: string;
  model?: string;
  location?: string;
}

export interface UpdateDevicePayload {
  name?: string;
  serialNumber?: string;
  model?: string;
  location?: string;
  status?: DeviceStatus;
}

