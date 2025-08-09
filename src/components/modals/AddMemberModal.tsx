import { FiLoader } from "react-icons/fi";
import ReusableModal from "../ui/ReusableModal";
import { NewMember } from "../../interfaces/Member";
import { days, months } from "../../utils/constant";

interface AddMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newMember: NewMember;
  setNewMember: (member: NewMember) => void;
  day: string;
  setDay: (day: string) => void;
  month: string;
  setMonth: (month: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  isAddingMember: boolean;
}

export default function AddMemberModal({
  open,
  onOpenChange,
  newMember,
  setNewMember,
  day,
  setDay,
  month,
  setMonth,
  onSubmit,
  isAddingMember,
}: AddMemberModalProps) {
  return (
    <ReusableModal
      open={open}
      onOpenChange={onOpenChange}
      title="Add New Member"
      description="Fill in the member's details below. Required fields are marked with *"
    >
      <form onSubmit={onSubmit}>
        {/* Full Name */}
        <div className="flex flex-col gap-4 mb-4">
          <label className="font-semibold" htmlFor="fullName">
            Full Name *
          </label>
          <input
            id="fullName"
            value={newMember.fullName}
            onChange={(e) =>
              setNewMember({ ...newMember, fullName: e.target.value })
            }
            required
            placeholder="Enter full name"
            className="focus:border-[#0053A6] focus:ring-[#0053A6] outline-0 px-4 py-2 border rounded-md border-[#ECF0F3] placeholder-[#BBBBCB] w-full"
          />
        </div>

        {/* Gender */}
        <div className="flex flex-col gap-2 mb-4">
          <label className="font-semibold" htmlFor="gender">
            Gender *
          </label>
          <select
            id="gender"
            value={newMember.gender}
            onChange={(e) =>
              setNewMember({ ...newMember, gender: e.target.value })
            }
            required
            className="border p-2 rounded-sm ring-0 cursor-pointer bg-white dark:bg-[#242529] text-[#44444B] dark:text-white appearance-none"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        {/* Birthday */}
        <div className="flex flex-col gap-2 mb-4">
          <label className="font-semibold">
            Birthday *{" "}
            <span className="text-sm font-normal text-gray-500">
              (Will be saved as MM/DD format)
            </span>
          </label>
          <div className="flex gap-2">
            <select
              value={month}
              required
              onChange={(e) => setMonth(e.target.value)}
              className="border p-2 rounded-sm flex-1 cursor-pointer bg-white dark:bg-[#242529] text-[#44444B] dark:text-white appearance-none focus:border-[#0053A6] focus:ring-[#0053A6] outline-0"
            >
              <option value="">Select month</option>
              {months.map((m, i) => (
                <option key={i} value={i + 1}>
                  {m}
                </option>
              ))}
            </select>
            <select
              required
              value={day}
              onChange={(e) => setDay(e.target.value)}
              className="border p-2 rounded-sm flex-1 cursor-pointer bg-white dark:bg-[#242529] text-[#44444B] dark:text-white appearance-none focus:border-[#0053A6] focus:ring-[#0053A6] outline-0"
            >
              <option value="">Select day</option>
              {days.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Email */}
        <div className="flex flex-col gap-2 mb-4">
          <label className="font-semibold" htmlFor="email">
            Email *
          </label>
          <input
            id="email"
            type="email"
            value={newMember.email}
            onChange={(e) =>
              setNewMember({ ...newMember, email: e.target.value })
            }
            required
            placeholder="Enter email address"
            className="focus:border-[#0053A6] focus:ring-[#0053A6] outline-0 px-4 py-2 border rounded-md border-[#ECF0F3] placeholder-[#BBBBCB] w-full"
          />
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-2 mb-4">
          <label className="font-semibold" htmlFor="phone">
            Phone Number *
          </label>
          <input
            id="phone"
            type="tel"
            value={newMember.phone}
            onChange={(e) =>
              setNewMember({ ...newMember, phone: e.target.value })
            }
            required
            placeholder="Enter phone number"
            className="focus:border-[#0053A6] focus:ring-[#0053A6] outline-0 px-4 py-2 border rounded-md border-[#ECF0F3] placeholder-[#BBBBCB] w-full"
          />
        </div>

        {/* Address */}
        <div className="flex flex-col gap-2 mb-4">
          <label className="font-semibold" htmlFor="address">
            Home Address *
          </label>
          <textarea
            required
            id="address"
            value={newMember.address}
            onChange={(e) =>
              setNewMember({ ...newMember, address: e.target.value })
            }
            placeholder="Enter home address"
            className="focus:border-[#0053A6] focus:ring-[#0053A6] outline-0 px-4 py-2 h-20 border rounded-md border-[#ECF0F3] placeholder-[#BBBBCB] w-full"
          />
        </div>

        {/* Relationship Status */}
        <div className="flex flex-col gap-2 mb-4">
          <label className="font-semibold" htmlFor="relationshipStatus">
            Relationship Status *
          </label>
          <select
            required
            id="relationshipStatus"
            value={newMember.relationshipStatus}
            onChange={(e) =>
              setNewMember({ ...newMember, relationshipStatus: e.target.value })
            }
            className="border p-2 rounded-sm ring-0 cursor-pointer bg-white dark:bg-[#242529] text-[#44444B] dark:text-white appearance-none"
          >
            <option value="">Select Status</option>
            <option value="single">Single</option>
            <option value="dating">Dating</option>
            <option value="married">Married</option>
          </select>
        </div>

        {/* Occupation */}
        <div className="flex flex-col gap-2 mb-4">
          <label className="font-semibold" htmlFor="occupation">
            Occupation *
          </label>
          <input
            required
            id="occupation"
            value={newMember.occupation}
            onChange={(e) =>
              setNewMember({ ...newMember, occupation: e.target.value })
            }
            placeholder="Enter occupation"
            className="focus:border-[#0053A6] focus:ring-[#0053A6] outline-0 px-4 py-2 border rounded-md border-[#ECF0F3] placeholder-[#BBBBCB] w-full"
          />
        </div>

        {/* Service Unit Status */}
        <div className="flex flex-col gap-2 mb-4">
          <label className="font-semibold">Are you in a service unit? *</label>
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <input
                id="inServiceYes"
                type="radio"
                name="inService"
                value="yes"
                checked={newMember.serviceUnitStatus === "yes"}
                onChange={() =>
                  setNewMember({ ...newMember, serviceUnitStatus: "yes" })
                }
                className="focus:ring-[#0053A6] h-4 w-4 text-[#0053A6] border-gray-300"
              />
              <label
                htmlFor="inServiceYes"
                className="text-[#44444B] dark:text-white"
              >
                Yes
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                id="inServiceNo"
                type="radio"
                name="inService"
                value="no"
                checked={newMember.serviceUnitStatus === "no"}
                onChange={() =>
                  setNewMember({ ...newMember, serviceUnitStatus: "no" })
                }
                className="focus:ring-[#0053A6] h-4 w-4 text-[#0053A6] border-gray-300"
              />
              <label
                htmlFor="inServiceNo"
                className="text-[#44444B] dark:text-white"
              >
                No
              </label>
            </div>
          </div>
        </div>

        {/* Service Unit Name */}
        <div className="flex flex-col gap-2 mb-4">
          <label className="font-semibold" htmlFor="serviceUnit">
            If yes, what is the name of your service unit
          </label>
          <input
            id="serviceUnit"
            value={newMember.serviceUnitName}
            onChange={(e) =>
              setNewMember({ ...newMember, serviceUnitName: e.target.value })
            }
            placeholder="Ambience"
            className="focus:border-[#0053A6] focus:ring-[#0053A6] outline-0 px-4 py-2 border rounded-md border-[#ECF0F3] placeholder-[#BBBBCB] w-full"
          />
        </div>

        {/* Reminder */}
        <div className="flex flex-col gap-2 mb-4">
          <label className="font-semibold">
            Would you like someone to check on you and pray with you?
          </label>
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <input
                required
                id="reminderYes"
                type="radio"
                name="reminder"
                value="yes"
                checked={newMember.reminder === "yes"}
                onChange={() => setNewMember({ ...newMember, reminder: "yes" })}
                className="focus:ring-[#0053A6] h-4 w-4 text-[#0053A6] border-gray-300"
              />
              <label
                htmlFor="reminderYes"
                className="text-[#44444B] dark:text-white"
              >
                Yes
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                id="reminderNo"
                type="radio"
                name="reminder"
                value="no"
                checked={newMember.reminder === "no"}
                onChange={() => setNewMember({ ...newMember, reminder: "no" })}
                className="focus:ring-[#0053A6] h-4 w-4 text-[#0053A6] border-gray-300"
              />
              <label
                htmlFor="reminderNo"
                className="text-[#44444B] dark:text-white"
              >
                No
              </label>
            </div>
          </div>
        </div>

        {/* Suggestions */}
        <div className="flex flex-col gap-2 mb-6">
          <label className="font-semibold" htmlFor="suggestions">
            Do you have any suggestions for MAP? (Your opinions are valid and
            matter to us.)
          </label>
          <textarea
            id="suggestions"
            value={newMember.suggestions}
            onChange={(e) =>
              setNewMember({ ...newMember, suggestions: e.target.value })
            }
            placeholder="Any additional information or suggestions"
            className="focus:border-[#0053A6] focus:ring-[#0053A6] outline-0 h-20 px-4 py-2 border rounded-md border-[#ECF0F3] placeholder-[#BBBBCB] w-full"
          />
        </div>

        <button
          type="submit"
          disabled={isAddingMember}
          className="flex disabled:opacity-40 justify-center px-4 py-2 bg-[#0053A6] text-white items-center gap-2 cursor-pointer rounded-md w-full"
        >
          {isAddingMember ? (
            <FiLoader className="w-6 h-6 text-white animate-spin" />
          ) : (
            "Add Member"
          )}
        </button>
      </form>
    </ReusableModal>
  );
}
