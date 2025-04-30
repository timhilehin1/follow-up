export interface Admin {
  id: string; // UUID
  name: string;
  email?: string | null;
  max_members?: number | null; // default is 25 if not provided
  active?: boolean | null; // default is true if not provided
  created_at?: string | null; // ISO timestamp string
  updated_at?: string | null; // ISO timestamp string
}
