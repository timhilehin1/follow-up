import { FiLoader } from "react-icons/fi";
import { Admin } from "../../interfaces/Admin";
import ReusableModal from "../ui/ReusableModal";
import { GoTrash } from "react-icons/go";
import PasswordInput from "../ui/PassswordInput";

interface DeleteAdminModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  admin: Admin | null;
  password: string;
  setPassword: (password: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isDeletingAdmin: boolean;
}

const DeleteAdminModal = ({
  open,
  onOpenChange,
  admin,
  password,
  setPassword,
  onSubmit,
  isDeletingAdmin,
}: DeleteAdminModalProps) => {
  if (!admin) return null;
  return (
    <ReusableModal
      open={open}
      onOpenChange={onOpenChange}
      title="Delete Admin"
      description="This action cannot be undone. This will permanently delete the admin
            account and remove all associated data."
    >
      <div className="space-y-4">
        {/* Admin Info */}
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Admin to delete:
          </p>
          <p className="font-medium text-gray-900 dark:text-gray-100">
            {admin.name}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {admin.email}
          </p>
          {admin.membersCount !== undefined && (
            <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">
              ⚠️ This admin has {admin.membersCount} member
              {admin.membersCount !== 1 ? "s" : ""} assigned
            </p>
          )}
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Password Confirmation */}
          <PasswordInput
            id="delete-admin"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password to confirm deletion"
            required
            label="Password"
            variant="danger"
          />

          {/* Warning */}
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <p className="text-red-800 dark:text-red-200 text-sm font-medium">
              ⚠️ Warning: This action is irreversible
            </p>
            <p className="text-red-600 dark:text-red-300 text-xs mt-1">
              All data associated with this admin will be permanently deleted.
              {admin.membersCount &&
                admin.membersCount > 0 &&
                " Members assigned to this admin will become unassigned."}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isDeletingAdmin}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isDeletingAdmin || !password.trim()}
              className="cursor-pointer px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isDeletingAdmin && <FiLoader className="w-4 h-4 animate-spin" />}
              <GoTrash size={16} />
              {isDeletingAdmin ? "Deleting..." : "Delete Admin"}
            </button>
          </div>
        </form>
      </div>
    </ReusableModal>
  );
};

export default DeleteAdminModal;
