// components/modals/DeleteMemberModal.tsx
import { FiLoader } from "react-icons/fi";
import { MdWarning } from "react-icons/md";
import ReusableModal from "../ui/ReusableModal";
import { Member } from "../../interfaces/Member";

interface DeleteMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: Member | null;
  password: string;
  setPassword: (password: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  isDeleting: boolean;
}

export default function DeleteMemberModal({
  open,
  onOpenChange,
  member,
  password,
  setPassword,
  onSubmit,
  isDeleting,
}: DeleteMemberModalProps) {
  return (
    <ReusableModal
      open={open}
      onOpenChange={onOpenChange}
      title={`Delete Member - ${member?.full_name}`}
      description="This action cannot be undone. Please enter password to confirm deletion."
    >
      <form onSubmit={onSubmit}>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <MdWarning size={20} className="text-red-600 dark:text-red-400" />
            <p className="font-semibold text-red-800 dark:text-red-200">
              Warning: This action is permanent
            </p>
          </div>
          <p className="text-sm text-red-700 dark:text-red-300">
            This will permanently delete <strong>{member?.full_name}</strong>{" "}
            and all associated notes. This action cannot be undone.
          </p>
        </div>

        <div className="flex flex-col gap-2 mb-6">
          <label className="font-semibold" htmlFor="delete-password">
            Password *
          </label>
          <input
            id="delete-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter password to confirm deletion"
            className="focus:border-red-500 focus:ring-red-500 outline-0 px-4 py-2 border rounded-md border-[#ECF0F3] placeholder-[#BBBBCB] w-full"
          />
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
            disabled={!password || isDeleting}
            className="flex flex-1 disabled:opacity-40 justify-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white items-center gap-2 cursor-pointer rounded-md"
          >
            {isDeleting ? (
              <FiLoader className="w-4 h-4 text-white animate-spin text-center self-center" />
            ) : (
              "Delete Member"
            )}
          </button>
        </div>
      </form>
    </ReusableModal>
  );
}
