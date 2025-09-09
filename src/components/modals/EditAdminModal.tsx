import { useState, useEffect } from "react";
import { MdErrorOutline } from "react-icons/md";
import { FiLoader } from "react-icons/fi";
import { Admin } from "../../interfaces/Admin";
import ReusableModal from "../ui/ReusableModal";

interface EditAdminModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  admin: Admin | null;
  onSubmit: (e: React.FormEvent) => void;
  isEditingAdmin: boolean;
  editAdmin: Admin | null;
  setEditAdmin: (admin: Admin | null) => void;
}

function EditAdminModal({
  open,
  onOpenChange,
  admin,
  onSubmit,
  isEditingAdmin,
  editAdmin,
  setEditAdmin,
}: EditAdminModalProps) {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Initialize form when modal opens or admin changes
  useEffect(() => {
    if (open && admin) {
      setEditAdmin({ ...admin });
      setErrors({});
    }
  }, [open, admin, setEditAdmin]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!editAdmin?.name?.trim()) {
      newErrors.name = "Name is required";
    }

    if (!editAdmin?.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editAdmin.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(e);
    }
  };

  const handleInputChange = (field: keyof Admin, value: string) => {
    if (editAdmin) {
      setEditAdmin({ ...editAdmin, [field]: value });
      // Clear error when user starts typing
      if (errors[field]) {
        setErrors({ ...errors, [field]: "" });
      }
    }
  };

  if (!admin) return null;

  return (
    <ReusableModal
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Admin"
      description="Update the admin information. All fields are required."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Field */}
        <div>
          <label
            htmlFor="edit-admin-name"
            className="block text-sm font-medium mb-1"
          >
            Full Name *
          </label>
          <input
            id="edit-admin-name"
            type="text"
            value={editAdmin?.name || ""}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className={`w-full p-3 border rounded-lg outline-none ${
              errors.name
                ? "border-red-500 focus:border-red-500"
                : "border-gray-300 focus:border-[#0053A6]"
            }`}
            placeholder="Enter admin's full name"
            disabled={isEditingAdmin}
          />
          {errors.name && (
            <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
              <MdErrorOutline size={16} />
              {errors.name}
            </div>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label
            htmlFor="edit-admin-email"
            className="block text-sm font-medium mb-1"
          >
            Email Address *
          </label>
          <input
            id="edit-admin-email"
            type="email"
            value={editAdmin?.email || ""}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className={`w-full p-3 border rounded-lg outline-none ${
              errors.email
                ? "border-red-500 focus:border-red-500"
                : "border-gray-300 focus:border-[#0053A6]"
            }`}
            placeholder="Enter admin's email address"
            disabled={isEditingAdmin}
          />
          {errors.email && (
            <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
              <MdErrorOutline size={16} />
              {errors.email}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            disabled={isEditingAdmin}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isEditingAdmin}
            className="px-4 py-2 bg-[#0053A6] text-white rounded-lg hover:bg-[#004494] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
          >
            {isEditingAdmin && <FiLoader className="w-4 h-4 animate-spin" />}
            {isEditingAdmin ? "Updating..." : "Update Admin"}
          </button>
        </div>
      </form>
    </ReusableModal>
  );
}

export default EditAdminModal;
