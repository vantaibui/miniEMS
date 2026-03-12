export enum TestConnectionStatus {
  InService = 'IN_SERVICE',
  OutOfService = 'OOS',
}

export type TestStatus = TestConnectionStatus;

export const TestConnectionStatusDisplay = {
  [TestConnectionStatus.InService]: 'In Service',
  [TestConnectionStatus.OutOfService]: 'Out of Service',
};