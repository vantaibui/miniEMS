import { dayjs } from '@libs/configs';

type DateInput = string | number | Date;

type DiffUnit =
  | 'millisecond'
  | 'second'
  | 'minute'
  | 'hour'
  | 'day'
  | 'week'
  | 'month'
  | 'year';

type AddUnit = DiffUnit;

export const DATE_FORMATS = {
  ISO: 'YYYY-MM-DDTHH:mm:ss[Z]',
  DATE: 'YYYY-MM-DD',
  DATE_TIME: 'YYYY-MM-DD HH:mm:ss',
  DATE_TIME_TZ: 'YYYY-MM-DD HH:mm:ss [UTC]Z',
  DISPLAY_DATE: 'DD/MM/YYYY',
  DISPLAY_DATE_TIME: 'DD/MM/YYYY HH:mm:ss',
  DISPLAY_TIME: 'HH:mm:ss',
} as const;

export function utcNow() {
  return dayjs.utc();
}

export function utcFrom(input: DateInput) {
  return dayjs.utc(input);
}

export function utcFromEpochMs(epochMs: number) {
  return dayjs.utc(epochMs);
}

export function toIsoUtc(input: DateInput) {
  return dayjs.utc(input).toISOString();
}

export function formatUtc(input: DateInput, format = DATE_FORMATS.DATE_TIME) {
  return dayjs.utc(input).format(format);
}

export function formatUtcOrFallback(
  input: DateInput | null | undefined,
  format: string = DATE_FORMATS.DATE_TIME,
  fallback = '--',
) {
  if (input === null || input === undefined) return fallback;
  const parsed = dayjs.utc(input);
  return parsed.isValid() ? parsed.format(format) : fallback;
}

export function formatEpochMsUtc(
  epochMs: number,
  format = DATE_FORMATS.DATE_TIME,
) {
  return dayjs.utc(epochMs).format(format);
}

export function formatUtcToLocal(
  input: DateInput,
  format = DATE_FORMATS.DISPLAY_DATE_TIME,
) {
  return dayjs.utc(input).local().format(format);
}

export function toEpochMsUtc(input: DateInput) {
  return dayjs.utc(input).valueOf();
}

export function toEpochSecondsUtc(input: DateInput) {
  return dayjs.utc(input).unix();
}

export function startOfUtcDay(input: DateInput) {
  return dayjs.utc(input).startOf('day');
}

export function endOfUtcDay(input: DateInput) {
  return dayjs.utc(input).endOf('day');
}

export function addUtc(input: DateInput, amount: number, unit: AddUnit) {
  return dayjs.utc(input).add(amount, unit);
}

export function subtractUtc(input: DateInput, amount: number, unit: AddUnit) {
  return dayjs.utc(input).subtract(amount, unit);
}

export function diffUtc(
  a: DateInput,
  b: DateInput,
  unit: DiffUnit = 'millisecond',
  float = false,
) {
  return dayjs.utc(a).diff(dayjs.utc(b), unit, float);
}

export function isValidDateInput(input: DateInput) {
  return dayjs(input).isValid();
}

export function isAfterUtc(a: DateInput, b: DateInput) {
  return dayjs.utc(a).isAfter(dayjs.utc(b));
}

export function isBeforeUtc(a: DateInput, b: DateInput) {
  return dayjs.utc(a).isBefore(dayjs.utc(b));
}

export function isSameUtc(
  a: DateInput,
  b: DateInput,
  unit: DiffUnit = 'millisecond',
) {
  return dayjs.utc(a).isSame(dayjs.utc(b), unit);
}
