export interface Member {
  id: string; // UUID
  full_name: string;
  phone: string;
  admin_id?: string | null;
  notes?: string | null;
  joined_date?: string | null; // Date in YYYY-MM-DD format
  active?: boolean | null;
  created_at?: string | null; // ISO timestamp
  updated_at?: string | null; // ISO timestamp
  email?: string | null;
  address?: string | null;
  relationship_status?: string | null;
  occupation?: string | null;
  service_unit_name?: string | null;
  service_unit_status?: string | null;
  reminder?: string | null;
  suggestions?: string | null;
  gender?: string | null;
}

export interface MemberNote {
  id: string;
  member_id: string;
  note: string;
  created_at: string;
  admin_name: string;
  admin_id: string;
}

// Define the interface for the new member form
export interface NewMember {
  fullName: string;
  gender: string;
  birthMonth: string;
  birthDay: string;
  email: string;
  address: string;
  relationshipStatus: string;
  phone: string;
  occupation: string;
  serviceUnitName: string;
  serviceUnitStatus: string;
  reminder: string;
  suggestions: string;
  birthday: string;
}

export const defaultMemberState: NewMember = {
  fullName: "",
  gender: "",
  birthMonth: "",
  birthDay: "",
  email: "",
  address: "",
  relationshipStatus: "",
  phone: "",
  occupation: "",
  serviceUnitName: "",
  serviceUnitStatus: "",
  reminder: "",
  suggestions: "",
  birthday: "",
};
