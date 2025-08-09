// components/modals/ReassignMemberModal.tsx
import { FiLoader } from "react-icons/fi";
import { MdErrorOutline } from "react-icons/md";
import ReusableModal from "../ui/ReusableModal";
import { Member } from "../../interfaces/Member";
import { Admin } from "../../interfaces/Admin";

interface ReassignMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: Member | null;
  admins: Admin[];
  selectedAdmin: string;
  setSelectedAdmin: (adminId: string) => void;
  password: string;
  setPassword: (password: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  isReassigning: boolean;
}

export default function ReassignMemberModal({
  open,
  onOpenChange,
  member,
  admins,
  selectedAdmin,
  setSelectedAdmin,
  password,
  setPassword,
  onSubmit,
  isReassigning,
}: ReassignMemberModalProps) {
  return (
    <ReusableModal
      open={open}
      onOpenChange={onOpenChange}
      title={`Reassign Member - ${member?.full_name}`}
      description="Select a new admin and enter password to complete the reassignment."
    >
      <form onSubmit={onSubmit}>
        <div className="flex flex-col gap-2 mb-6">
          <label className="font-semibold" htmlFor="reassign-admin">
            Select New Admin *
          </label>
          <select
            id="reassign-admin"
            className="border p-2 rounded-sm cursor-pointer bg-white dark:bg-[#242529] text-[#44444B] dark:text-white appearance-none"
            required
            value={selectedAdmin}
            onChange={(e) => setSelectedAdmin(e.target.value)}
          >
            <option value="">Select Admin</option>
            {admins
              .filter((admin) => admin.id !== member?.admin_id) // Don't show current admin
              .map((admin) => (
                <option key={admin.id} value={admin.id}>
                  {admin.name}
                </option>
              ))}
          </select>
        </div>

        <div className="flex flex-col gap-2 mb-6">
          <label className="font-semibold" htmlFor="password">
            Password *
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter password to confirm reassignment"
            className="focus:border-[#0053A6] focus:ring-[#0053A6] outline-0 px-4 py-2 border rounded-md border-[#ECF0F3] placeholder-[#BBBBCB] w-full"
          />
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-3 mb-6">
          <div className="flex items-center gap-2">
            <MdErrorOutline
              size={16}
              className="text-yellow-600 dark:text-yellow-400"
            />
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              This action will transfer all member data and notes to the
              selected admin.
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={!selectedAdmin || !password || isReassigning}
          className="flex disabled:opacity-40 justify-center px-4 py-2 bg-[#0053A6] text-white items-center gap-2 cursor-pointer rounded-md w-full"
        >
          {isReassigning ? (
            <FiLoader className="w-6 h-6 text-white animate-spin text-center" />
          ) : (
            "Reassign Member"
          )}
        </button>
      </form>
    </ReusableModal>
  );
}
