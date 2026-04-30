import { ReactNode } from 'react';
import { FieldValues, Path } from 'react-hook-form';

export interface IBusinessHours {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  openTime: number; // Minutes from midnight (0-1439)
  closeTime: number; // Minutes from midnight (0-1439)
  isClosed: boolean;
}
export interface IPageBanner {
  menu: string;
  location: string;
  gallery: string;
  reserveTable: string;
}

export interface ICloudinary {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
  folder: string;
  secureUrlBase: string;
}

export interface IMetadata {
  title: string;
  applicationName: string;
  description: string;
  keywords: string[];
  openGraphImage: string;
}
export interface ITermsPolicy {
  terms: string;
  policy: string;
}
export interface IGeneral extends Document {
  companyName: string;
  companyDialCode: string;
  companyPhone: string;
  companyAddress: string;
  logo: string;
  favicon: string;
  supportEmail: string;
  ownerName: string;
  ownerEmail: string;
  facebook: string;
  instagram: string;
  twitter: string;
  youtube: string;
}
export interface ISettings extends Document {
  general: IGeneral;
  pageBanner: IPageBanner;
  cloudinary: ICloudinary;
  metadata: IMetadata;
  termsPolicy: ITermsPolicy;
  businessHours: IBusinessHours[];
  createdAt?: Date;
  updatedAt?: Date;
}
export type AuthUser = {
  _id: string;
};

export interface FormPasswordInputProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  label?: string;
  id?: string;
  placeholder?: string;
  rules?: Record<string, any>;
  className?: string;
  prefix?: ReactNode;
}

export interface FormInputProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  label?: string;
  type?: string;
  id?: string;
  placeholder?: string;
  rules?: Record<string, any>;
  className?: string;
  prefix?: ReactNode;
  postfix?: ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export type ButtonProps = {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
};
