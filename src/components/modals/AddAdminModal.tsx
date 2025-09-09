import { useState } from "react";
import { MdErrorOutline } from "react-icons/md";
import { FiLoader } from "react-icons/fi";
import ReusableModal from "../ui/ReusableModal";

interface NewAdmin {
  name: string;
  email: string;
}

interface AddAdminModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newAdmin: NewAdmin;
  setNewAdmin: (admin: NewAdmin) => void;
  onSubmit: (e: React.FormEvent) => void;
  isAddingAdmin: boolean;
}

function AddAdminModal({
  open,
  onOpenChange,
  newAdmin,
  setNewAdmin,
  onSubmit,
  isAddingAdmin,
}: AddAdminModalProps) {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!newAdmin.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!newAdmin.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newAdmin.email)) {
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

  const handleInputChange = (field: keyof NewAdmin, value: string) => {
    setNewAdmin({ ...newAdmin, [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  return (
    <ReusableModal
      open={open}
      onOpenChange={onOpenChange}
      title={"Add New Admin"}
      description="Create a new admin account. Fill in all required fields."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Field */}
        <div>
          <label
            htmlFor="admin-name"
            className="block text-sm font-medium mb-1"
          >
            Full Name *
          </label>
          <input
            id="admin-name"
            type="text"
            value={newAdmin.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className={`w-full p-3 border rounded-lg outline-none ${
              errors.name
                ? "border-red-500 focus:border-red-500"
                : "border-gray-300 focus:border-[#0053A6]"
            }`}
            placeholder="Enter admin's full name"
            disabled={isAddingAdmin}
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
            htmlFor="admin-email"
            className="block text-sm font-medium mb-1"
          >
            Email Address *
          </label>
          <input
            id="admin-email"
            type="email"
            value={newAdmin.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className={`w-full p-3 border rounded-lg outline-none ${
              errors.email
                ? "border-red-500 focus:border-red-500"
                : "border-gray-300 focus:border-[#0053A6]"
            }`}
            placeholder="Enter admin's email address"
            disabled={isAddingAdmin}
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
            disabled={isAddingAdmin}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isAddingAdmin}
            className="px-4 py-2 bg-[#0053A6] text-white rounded-lg hover:bg-[#004494] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
          >
            {isAddingAdmin && <FiLoader className="w-4 h-4 animate-spin" />}
            {isAddingAdmin ? "Adding..." : "Add Admin"}
          </button>
        </div>
      </form>
    </ReusableModal>
  );
}

export default AddAdminModal;
