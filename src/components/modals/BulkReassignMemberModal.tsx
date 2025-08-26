// components/modals/BulkReassignMemberModal.tsx
import { FiLoader } from "react-icons/fi";
import { MdErrorOutline, MdGroupWork } from "react-icons/md";
import ReusableModal from "../ui/ReusableModal";
import { Member } from "../../interfaces/Member";
import { Admin } from "../../interfaces/Admin";
import PasswordInput from "../ui/PassswordInput";

interface BulkReassignMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedMembers: Member[];
  admins: Admin[];
  selectedAdmin: string;
  setSelectedAdmin: (adminId: string) => void;
  password: string;
  setPassword: (password: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  isReassigning: boolean;
}

export default function BulkReassignMemberModal({
  open,
  onOpenChange,
  selectedMembers,
  admins,
  selectedAdmin,
  setSelectedAdmin,
  password,
  setPassword,
  onSubmit,
  isReassigning,
}: BulkReassignMemberModalProps) {
  const memberCount = selectedMembers.length;

  return (
    <ReusableModal
      open={open}
      onOpenChange={onOpenChange}
      title={`Bulk Reassign ${memberCount} Member${
        memberCount !== 1 ? "s" : ""
      }`}
      description={`Select a new admin and enter password to reassign ${memberCount} member${
        memberCount !== 1 ? "s" : ""
      }.`}
    >
      <form onSubmit={onSubmit}>
        {/* Selected Members Summary */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <MdGroupWork
              size={20}
              className="text-blue-600 dark:text-blue-400"
            />
            <p className="font-semibold text-blue-800 dark:text-blue-200">
              {memberCount} Member{memberCount !== 1 ? "s" : ""} Selected
            </p>
          </div>
          <div className="max-h-32 overflow-y-auto">
            <div className="grid grid-cols-1 gap-1">
              {selectedMembers.map((member, index) => (
                <p
                  key={member.id}
                  className="text-sm text-blue-700 dark:text-blue-300"
                >
                  {index + 1}. {member.full_name}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 mb-6">
          <label className="font-semibold" htmlFor="bulk-reassign-admin">
            Select New Admin *
          </label>
          <select
            id="bulk-reassign-admin"
            className="border p-2 rounded-sm cursor-pointer bg-white dark:bg-[#242529] text-[#44444B] dark:text-white appearance-none"
            required
            value={selectedAdmin}
            onChange={(e) => setSelectedAdmin(e.target.value)}
          >
            <option value="">Select Admin</option>
            {admins.map((admin) => (
              <option key={admin.id} value={admin.id}>
                {admin.name}
              </option>
            ))}
          </select>
        </div>

        <PasswordInput
          id="bulk-reassign-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password to confirm bulk reassignment"
          required
          label="Password"
        />

        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-3 mb-6">
          <div className="flex items-center gap-2">
            <MdErrorOutline
              size={16}
              className="text-yellow-600 dark:text-yellow-400"
            />
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              This action will transfer all selected member data and notes to
              the selected admin.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!selectedAdmin || !password || isReassigning}
            className="flex flex-1 disabled:opacity-40 justify-center px-4 py-2 bg-[#0053A6] text-white items-center gap-2 cursor-pointer rounded-md"
          >
            {isReassigning ? (
              <FiLoader className="w-6 h-6 text-white animate-spin text-center" />
            ) : (
              `Reassign ${memberCount} Member${memberCount !== 1 ? "s" : ""}`
            )}
          </button>
        </div>
      </form>
    </ReusableModal>
  );
}
