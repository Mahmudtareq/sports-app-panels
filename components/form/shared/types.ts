// our project types
export interface Project {
  id: number;
  title: string;
  image: string;
  description: string;
}

// our v types

export interface StrengthItem {
  id: number;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}
