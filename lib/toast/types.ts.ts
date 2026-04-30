export type ToastMessageTypes =
  | string
  | {
      title?: string;
      description?: string;
      message?: string;
    };

export interface ToastOptions {
  duration?: number;
  id?: string;
  icon?: React.ReactElement | string | null;
}
