'use client';
import { cn } from '@/lib/utils';
import { AlertTriangle, Check, InfoIcon, Loader2, ShieldAlert, X } from 'lucide-react';
import { toast as hotToast, Toaster } from 'react-hot-toast';

// Toast type configuration
const TOAST_CONFIG = {
  success: {
    title: 'Success!',
    icon: Check,
    bgColor: 'bg-green-500',
    textColor: 'text-green-500',
    hoverColor: 'hover:text-green-700 dark:hover:text-green-400',
  },
  error: {
    title: 'Error!',
    icon: ShieldAlert,
    bgColor: 'bg-red-500',
    textColor: 'text-red-500',
    hoverColor: 'hover:text-red-700 dark:hover:text-red-400',
  },
  warning: {
    title: 'Warning!',
    icon: AlertTriangle,
    bgColor: 'bg-yellow-500',
    textColor: 'text-yellow-500',
    hoverColor: 'hover:text-yellow-700 dark:hover:text-yellow-400',
  },
  loading: {
    title: 'Loading...',
    icon: Loader2,
    bgColor: 'bg-blue-500',
    textColor: 'text-blue-500',
    hoverColor: 'hover:text-blue-700 dark:hover:text-blue-400',
  },
  info: {
    title: 'Info',
    icon: InfoIcon,
    bgColor: 'bg-blue-500',
    textColor: 'text-blue-500',
    hoverColor: 'hover:text-blue-700 dark:hover:text-blue-400',
  },
  custom: {
    title: 'Notification',
    icon: InfoIcon,
    bgColor: 'bg-purple-500',
    textColor: 'text-purple-500',
    hoverColor: 'hover:text-purple-700 dark:hover:text-purple-400',
  },
  default: {
    title: 'Notification',
    icon: InfoIcon,
    bgColor: 'bg-gray-500',
    textColor: 'text-gray-500',
    hoverColor: 'hover:text-gray-700 dark:hover:text-gray-400',
  },
} as const;

// Helper function to get toast configuration
const getToastConfig = (type: string) => {
  return TOAST_CONFIG[type as keyof typeof TOAST_CONFIG] || TOAST_CONFIG.default;
};

// Toaster Component
const ToasterComponents = () => {
  return (
    <Toaster position="top-center">
      {(t) => {
        // Parse the message
        let title = '';
        let customType = '';
        let hasCustomIcon = false;

        try {
          const parsed = JSON.parse(t.message as string);
          title = parsed.title || '';
          customType = parsed.type || '';
          hasCustomIcon = parsed.hasCustomIcon || false;
        } catch {
          // Fallback if parsing fails - do nothing, use defaults
        }

        // Determine the actual toast type
        const toastType = customType || t.type || 'default';
        const config = getToastConfig(toastType);

        // Use custom title or default from config
        const displayTitle = title || config.title;

        // Get the icon component
        const IconComponent = config.icon;
        const isLoading = toastType === 'loading';
        const hasCustomReactIcon = toastType === 'custom' && hasCustomIcon && t.icon;

        return (
          <div
            className={cn(
              'relative flex items-center gap-3 rounded-lg bg-white dark:bg-gray-800 p-3 shadow-lg min-w-75 max-w-md transition-all duration-300',
              t.visible ? 'animate-in slide-in-from-top-2' : ''
            )}
          >
            {/* Colored Left Border */}
            <div
              className={cn('absolute left-0 top-0 bottom-0 w-1.5 rounded-l-full', config.bgColor)}
            />

            {/* Icon Container */}
            <div
              className={cn(
                'shrink-0 flex items-center justify-center w-6 h-6 rounded-full text-white',
                config.bgColor
              )}
            >
              {hasCustomReactIcon ? (
                <span className="flex items-center justify-center w-4 h-4">{t.icon}</span>
              ) : (
                <IconComponent size={16} className={isLoading ? 'animate-spin' : ''} />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-base text-gray-900 dark:text-white">
                {displayTitle}
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                hotToast.remove(t.id);
              }}
              className={cn('shrink-0 transition-colors', config.textColor, config.hoverColor)}
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>
        );
      }}
    </Toaster>
  );
};

export default ToasterComponents;

/**
 * Toast Component with full type support
 *
 * Usage:
 * - toast.success("Message") or toast.success({ title: "Title", description: "Desc" })
 * - toast.error("Message") or toast.error({ title: "Title", description: "Desc" })
 * - toast.warning("Message") or toast.warning({ title: "Title", description: "Desc" })
 * - toast.info("Message") or toast.info({ title: "Title", description: "Desc" })
 * - toast.loading("Message") or toast.loading({ title: "Title", description: "Desc" })
 * - toast.custom("Message", { icon: <YourIcon /> }) or toast.custom({ title: "Title", description: "Desc" }, { icon: <YourIcon /> })
 *
 * All methods support options: { duration: 5000, id: 'unique-id' }
 */
