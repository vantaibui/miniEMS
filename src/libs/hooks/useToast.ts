import { toast, type ToastOptions, type UpdateOptions } from 'react-toastify';

export const useToast = () => {
  const defaultOptions: ToastOptions = {
    position: 'bottom-right',
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    draggable: true,
    theme: 'light',
  };

  return {
    success: (message: string, options?: ToastOptions) => {
      toast.success(message, { ...defaultOptions, ...options });
    },

    error: (message: string, options?: ToastOptions) => {
      toast.error(message, { ...defaultOptions, autoClose: 5000, ...options });
    },

    warning: (message: string, options?: ToastOptions) => {
      toast.warning(message, { ...defaultOptions, ...options });
    },

    info: (message: string, options?: ToastOptions) => {
      toast.info(message, { ...defaultOptions, ...options });
    },

    loading: (message: string, options?: ToastOptions) => {
      return toast.loading(message, { ...defaultOptions, ...options });
    },

    update: (toastId: number | string, options?: UpdateOptions) => {
      toast.update(toastId, options);
    },

    dismiss: (toastId?: number | string) => {
      toast.dismiss(toastId);
    },

    promise: <T>(
      promise: Promise<T> | (() => Promise<T>),
      messages: {
        pending?: string;
        success?: string;
        error?: string;
      },
      options?: ToastOptions,
    ) => {
      return toast.promise(promise, messages, {
        ...defaultOptions,
        ...options,
      });
    },

    isActive: (toastId: number | string) => toast.isActive(toastId),
  };
};
