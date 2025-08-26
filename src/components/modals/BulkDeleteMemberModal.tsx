import { FiLoader } from "react-icons/fi";
import { MdWarning, MdGroupWork } from "react-icons/md";
import ReusableModal from "../ui/ReusableModal";
import { Member } from "../../interfaces/Member";
import PasswordInput from "../ui/PassswordInput";

interface BulkDeleteMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedMembers: Member[];
  password: string;
  setPassword: (password: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  isDeleting: boolean;
}

export default function BulkDeleteMemberModal({
  open,
  onOpenChange,
  selectedMembers,
  password,
  setPassword,
  onSubmit,
  isDeleting,
}: BulkDeleteMemberModalProps) {
  const memberCount = selectedMembers.length;

  return (
    <ReusableModal
      open={open}
      onOpenChange={onOpenChange}
      title={`Bulk Delete ${memberCount} Member${memberCount !== 1 ? "s" : ""}`}
      description="This action cannot be undone. Please enter password to confirm bulk deletion."
    >
      <form onSubmit={onSubmit}>
        {/* Selected Members Summary */}
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <MdGroupWork
              size={20}
              className="text-gray-600 dark:text-gray-400"
            />
            <p className="font-semibold text-gray-800 dark:text-gray-200">
              {memberCount} Member{memberCount !== 1 ? "s" : ""} Selected for
              Deletion
            </p>
          </div>
          <div className="max-h-32 overflow-y-auto">
            <div className="grid grid-cols-1 gap-1">
              {selectedMembers.map((member, index) => (
                <p
                  key={member.id}
                  className="text-sm text-gray-700 dark:text-gray-300"
                >
                  {index + 1}. {member.full_name}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <MdWarning size={20} className="text-red-600 dark:text-red-400" />
            <p className="font-semibold text-red-800 dark:text-red-200">
              Warning: This action is permanent
            </p>
          </div>
          <p className="text-sm text-red-700 dark:text-red-300">
            This will permanently delete{" "}
            <strong>
              {memberCount} member{memberCount !== 1 ? "s" : ""}
            </strong>{" "}
            and all their associated notes. This action cannot be undone.
          </p>
        </div>

        <PasswordInput
          id="bulk-delete-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password to confirm bulk deletion"
          required
          label="Password"
          variant="danger"
        />

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
            disabled={!password || isDeleting}
            className="flex flex-1 disabled:opacity-40 justify-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white items-center gap-2 cursor-pointer rounded-md"
          >
            {isDeleting ? (
              <FiLoader className="w-4 h-4 text-white animate-spin text-center self-center" />
            ) : (
              `Delete ${memberCount} Member${memberCount !== 1 ? "s" : ""}`
            )}
          </button>
        </div>
      </form>
    </ReusableModal>
  );
}
