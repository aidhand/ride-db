export interface ListProps<T> {
  items: T[];
  error: Error | string | null;
  status: "success" | "error" | "pending";

  filter?: {
    [key: string]: string | string[];
  };
  sort?: {
    by: string;
    order: boolean;
  };
}

export interface SortableColumns {
  name?: string;
  slug?: string;
  brand?: string | null;
  category?: string | null;
  created_at?: Date | string | null;
}
