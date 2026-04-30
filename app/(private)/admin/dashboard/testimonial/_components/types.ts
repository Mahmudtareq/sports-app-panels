import { ReactNode } from "react";

type TestimonialTypes = {
  _id: string;
  authorName: string;
  image: string;
  authorRole: string;
  quote: string;
  status?: boolean;
  createdAt: string;
  updatedAt: string;
};

export interface FormDataTypes {
  authorName: string;
  image: string;
  authorRole: string;
  quote: string;
  status: boolean;
}

export interface FormModalProps {
  testimonial?: TestimonialTypes | null;
  isEditMode?: boolean;
}

export interface DeleteModalProps {
  trigger: ReactNode;
  testimonialId: string;
  title?: string;
  description?: string;
  itemName?: string;
}

export interface ToggleSwitchProps {
  testimonialId: string;
  initialStatus: boolean;
  onStatusChange?: (newStatus: boolean) => void;
}

export interface TableToolbarProps {
  tableId: string;
}

export interface Category {
  _id: string;
  authorName: string;
  authorRole: string;
  quote: string;
  status: boolean;
  image: string;
  createdAt: string;
  updatedAt: string;
}
