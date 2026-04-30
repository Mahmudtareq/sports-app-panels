import { ToastMessageTypes, ToastOptions } from '@/lib/toast/types.ts';
import { toast as hotToast } from 'react-hot-toast';
// Types

// Helper to parse and format messages
const parseToastMessage = (message: ToastMessageTypes) => {
  if (typeof message === 'string') {
    return { description: message };
  }
  return {
    title: message.title,
    description: message.description || message.message || '',
  };
};

export const ToastMessage = {
  success: (message: ToastMessageTypes, options?: ToastOptions) => {
    const parsed = parseToastMessage(message);
    return hotToast.success(JSON.stringify(parsed), {
      duration: options?.duration || 3000,
      id: options?.id,
    });
  },

  error: (message: ToastMessageTypes, options?: ToastOptions) => {
    const parsed = parseToastMessage(message);
    return hotToast.error(JSON.stringify(parsed), {
      duration: options?.duration || 3000,
      id: options?.id,
    });
  },

  warning: (message: ToastMessageTypes, options?: ToastOptions) => {
    const parsed = parseToastMessage(message);
    return hotToast(JSON.stringify({ ...parsed, type: 'warning' }), {
      duration: options?.duration || 3000,
      id: options?.id,
      icon: '⚠️',
    });
  },

  info: (message: ToastMessageTypes, options?: ToastOptions) => {
    const parsed = parseToastMessage(message);
    return hotToast(JSON.stringify({ ...parsed, type: 'info' }), {
      duration: options?.duration || 3000,
      id: options?.id,
    });
  },

  loading: (message: ToastMessageTypes, options?: ToastOptions) => {
    const parsed = parseToastMessage(message);
    return hotToast.loading(JSON.stringify(parsed), {
      duration: options?.duration || Infinity,
      id: options?.id,
    });
  },

  custom: (message: ToastMessageTypes, options?: ToastOptions) => {
    const parsed = parseToastMessage(message);
    return hotToast(
      JSON.stringify({
        ...parsed,
        type: 'custom',
        hasCustomIcon: !!options?.icon,
      }),
      {
        duration: options?.duration || 3000,
        id: options?.id,
        icon: options?.icon,
      }
    );
  },

  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: ToastMessageTypes;
      success: ToastMessageTypes;
      error: ToastMessageTypes;
    },
    options?: ToastOptions
  ) => {
    return hotToast.promise(
      promise,
      {
        loading: JSON.stringify(parseToastMessage(messages.loading)),
        success: JSON.stringify(parseToastMessage(messages.success)),
        error: JSON.stringify(parseToastMessage(messages.error)),
      },
      {
        duration: options?.duration || 3000,
        id: options?.id,
      }
    );
  },

  dismiss: (toastId?: string) => hotToast.dismiss(toastId),
  remove: (toastId?: string) => hotToast.remove(toastId),
};
