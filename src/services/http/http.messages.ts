export const HTTP_DEFAULT_SUCCESS_MESSAGES = {
  create: 'Created successfully',
  update: 'Updated successfully',
  delete: 'Deleted successfully',
  save: 'Saved successfully',
} as const;

export type HttpSuccessAction =
  keyof typeof HTTP_DEFAULT_SUCCESS_MESSAGES;

/**
 * resolveSuccessMessage
 * - Ưu tiên message từ backend (nếu có).
 * - Nếu backend không trả message hoặc message rỗng, fallback về common message theo action.
 */
export const resolveSuccessMessage = (
  backendMessage: string | undefined,
  action: HttpSuccessAction = 'save',
) => {
  const msg = backendMessage?.trim();
  return msg ? msg : HTTP_DEFAULT_SUCCESS_MESSAGES[action];
};

