import { useState } from "react";
import { supabase } from "../lib/supabase";
import { toast, Toaster } from "sonner";
import { MdErrorOutline } from "react-icons/md";

export default function NewMember() {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const defaultMemberState = {
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

  const [newMember, setNewMember] = useState(defaultMemberState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  async function handleAddMember(e: React.FormEvent) {
    e.preventDefault();

    // Validate required fields
    if (
      !newMember.fullName ||
      !newMember.gender ||
      !newMember.phone ||
      !newMember.email ||
      !newMember.address ||
      !newMember.relationshipStatus ||
      !newMember.occupation ||
      !newMember.serviceUnitStatus ||
      !newMember.reminder ||
      !newMember.birthday
    ) {
      return;
    }
    setIsSubmitting(true);
    try {
      const { data: emailExists } = await supabase
        .from("members")
        .select("id")
        .eq("email", newMember.email)
        .limit(1);

      if (emailExists && emailExists.length > 0) {
        toast.error("A member with this email already exists", {
          icon: <MdErrorOutline size={20} color="#FF3B30" />,
        });
        return;
      }

      // Check if phone already exists in the database
      const { data: phoneExists } = await supabase
        .from("members")
        .select("id")
        .eq("phone", newMember.phone)
        .limit(1);

      if (phoneExists && phoneExists.length > 0) {
        toast.error("A member with this phone number already exists", {
          icon: <MdErrorOutline size={20} color="#FF3B30" />,
        });
        return;
      }

      // Map newMember object to match database schema field names
      const { error } = await supabase.from("members").insert({
        full_name: newMember.fullName,
        gender: newMember.gender,
        email: newMember.email,
        phone: newMember.phone,
        address: newMember.address,
        relationship_status: newMember.relationshipStatus,
        occupation: newMember.occupation,
        service_unit_status: newMember.serviceUnitStatus,
        service_unit_name: newMember.serviceUnitName || null, // Only if service_unit_status is "yes"
        birthday: newMember.birthday,
        reminder: newMember.reminder,
        suggestions: newMember.suggestions || null,
      });

      if (error) {
        console.error("Error adding member:", error);
        toast.error(
          error.message || "An error occurred, please try again later",
          {
            icon: <MdErrorOutline size={20} color="#FF3B30" />,
          }
        );
        return;
      }

      // Reset form and close modal
      setNewMember({
        ...defaultMemberState,
      });
      setIsSubmitted(true);
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("Unexpected error", {
        icon: <MdErrorOutline size={20} color="#FF3B30" />,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white h-screen rounded-lg shadow-lg">
        <div className="text-center py-10">
          <svg
            className="w-16 h-16 text-green-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            CHEMIST MAP MEMBERSHIP DATABASE!
          </h2>
          <p className="text-gray-600 mb-6">Your response has been recorded.</p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Submit Another Response
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto pb-10">
      <Toaster position="top-right" />
      {/* Form Header */}
      <div className="bg-blue-600 text-white p-6 rounded-t-lg border-b-8 border-blue-800">
        <h1 className="text-2xl font-bold">CHEMIST MAP MEMBERSHIP DATABASE</h1>
        <p className="mt-2">
          Help us keep our records up to date by filling out this form. It only
          takes a minute—thank you for your cooperation! 😊
        </p>
      </div>

      <form onSubmit={handleAddMember} className="flex flex-col gap-4">
        {/* Full Name */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-4">
          <label
            className="block font-medium text-gray-800 mb-2"
            htmlFor="fullName"
          >
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            id="fullName"
            value={newMember.fullName}
            onChange={(e) =>
              setNewMember({ ...newMember, fullName: e.target.value })
            }
            required
            placeholder="Your answer"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Gender */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-4">
          <label
            className="block font-medium text-gray-800 mb-2"
            htmlFor="gender"
          >
            Gender <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-col gap-2">
            <div className="flex items-center">
              <input
                id="male"
                type="radio"
                name="gender"
                value="male"
                checked={newMember.gender === "male"}
                onChange={(e) =>
                  setNewMember({ ...newMember, gender: e.target.value })
                }
                required
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="male" className="ml-2 text-gray-700">
                Male
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="female"
                type="radio"
                name="gender"
                value="female"
                checked={newMember.gender === "female"}
                onChange={(e) =>
                  setNewMember({ ...newMember, gender: e.target.value })
                }
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="female" className="ml-2 text-gray-700">
                Female
              </label>
            </div>
          </div>
        </div>

        {/* Birthday */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-4">
          <label className="block font-medium text-gray-800 mb-2">
            Birthday <span className="text-red-500">*</span>
            <span className="text-sm font-normal text-gray-500 ml-2">
              (Will be saved as MM/DD format)
            </span>
          </label>
          <div className="flex gap-4">
            <div className="w-1/2">
              <select
                id="birthday-month"
                value={newMember.birthMonth}
                onChange={(e) =>
                  setNewMember({ ...newMember, birthMonth: e.target.value })
                }
                required
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Month</option>
                {months.map((m, i) => (
                  <option key={i} value={(i + 1).toString().padStart(2, "0")}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-1/2">
              <select
                id="birthday-day"
                value={newMember.birthDay}
                onChange={(e) =>
                  setNewMember({
                    ...newMember,
                    birthDay: e.target.value,
                    birthday: `${newMember.birthMonth}/${e.target.value}`,
                  })
                }
                required
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Day</option>
                {days.map((d) => (
                  <option key={d} value={d.toString().padStart(2, "0")}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Email */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-4">
          <label
            className="block font-medium text-gray-800 mb-2"
            htmlFor="email"
          >
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            value={newMember.email}
            onChange={(e) =>
              setNewMember({ ...newMember, email: e.target.value })
            }
            required
            placeholder="Your answer"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Home Address */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-4">
          <label
            className="block font-medium text-gray-800 mb-2"
            htmlFor="address"
          >
            Home Address <span className="text-red-500">*</span>
          </label>
          <textarea
            id="address"
            value={newMember.address}
            onChange={(e) =>
              setNewMember({ ...newMember, address: e.target.value })
            }
            required
            placeholder="Your answer"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
          />
        </div>

        {/* Relationship Status */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-4">
          <label
            className="block font-medium text-gray-800 mb-2"
            htmlFor="relationshipStatus"
          >
            Relationship Status <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-col gap-2">
            <div className="flex items-center">
              <input
                id="single"
                type="radio"
                name="relationshipStatus"
                value="single"
                checked={newMember.relationshipStatus === "single"}
                onChange={(e) =>
                  setNewMember({
                    ...newMember,
                    relationshipStatus: e.target.value,
                  })
                }
                required
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="single" className="ml-2 text-gray-700">
                Single
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="dating"
                type="radio"
                name="relationshipStatus"
                value="dating"
                checked={newMember.relationshipStatus === "dating"}
                onChange={(e) =>
                  setNewMember({
                    ...newMember,
                    relationshipStatus: e.target.value,
                  })
                }
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="dating" className="ml-2 text-gray-700">
                Dating
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="married"
                type="radio"
                name="relationshipStatus"
                value="married"
                checked={newMember.relationshipStatus === "married"}
                onChange={(e) =>
                  setNewMember({
                    ...newMember,
                    relationshipStatus: e.target.value,
                  })
                }
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="married" className="ml-2 text-gray-700">
                Married
              </label>
            </div>
          </div>
        </div>

        {/* Phone Number */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-4">
          <label
            className="block font-medium text-gray-800 mb-2"
            htmlFor="phone"
          >
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            value={newMember.phone}
            onChange={(e) =>
              setNewMember({ ...newMember, phone: e.target.value })
            }
            required
            placeholder="Your answer"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Occupation */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-4">
          <label
            className="block font-medium text-gray-800 mb-2"
            htmlFor="occupation"
          >
            Occupation <span className="text-red-500">*</span>
          </label>
          <input
            id="occupation"
            value={newMember.occupation}
            onChange={(e) =>
              setNewMember({ ...newMember, occupation: e.target.value })
            }
            required
            placeholder="Your answer"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Service Unit */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-4">
          <label className="block font-medium text-gray-800 mb-4">
            Are you in a service unit? <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-col gap-2">
            <div className="flex items-center">
              <input
                id="serviceYes"
                type="radio"
                name="serviceUnitStatus"
                value="yes"
                checked={newMember.serviceUnitStatus === "yes"}
                onChange={(e) =>
                  setNewMember({
                    ...newMember,
                    serviceUnitStatus: e.target.value,
                  })
                }
                required
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="serviceYes" className="ml-2 text-gray-700">
                Yes
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="serviceNo"
                type="radio"
                name="serviceUnitStatus"
                value="no"
                checked={newMember.serviceUnitStatus === "no"}
                onChange={(e) =>
                  setNewMember({
                    ...newMember,
                    serviceUnitStatus: e.target.value,
                  })
                }
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="serviceNo" className="ml-2 text-gray-700">
                No
              </label>
            </div>
          </div>
        </div>

        {/* Service Unit Name */}
        {newMember.serviceUnitStatus === "yes" && (
          <div className="bg-white p-6 rounded-lg shadow-sm mb-4">
            <label
              className="block font-medium text-gray-800 mb-2"
              htmlFor="serviceUnitName"
            >
              What is the name of your service unit?
            </label>
            <input
              id="serviceUnitName"
              value={newMember.serviceUnitName}
              onChange={(e) =>
                setNewMember({ ...newMember, serviceUnitName: e.target.value })
              }
              placeholder="Your answer"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {/* Reminder */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-4">
          <label className="block font-medium text-gray-800 mb-4">
            Would you like someone to check on you and pray with you?
            <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-col gap-2">
            <div className="flex items-center">
              <input
                id="reminderYes"
                type="radio"
                name="reminder"
                value="yes"
                checked={newMember.reminder === "yes"}
                onChange={(e) =>
                  setNewMember({ ...newMember, reminder: e.target.value })
                }
                required
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="reminderYes" className="ml-2 text-gray-700">
                Yes
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="reminderNo"
                type="radio"
                name="reminder"
                value="no"
                checked={newMember.reminder === "no"}
                onChange={(e) =>
                  setNewMember({ ...newMember, reminder: e.target.value })
                }
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="reminderNo" className="ml-2 text-gray-700">
                No
              </label>
            </div>
          </div>
        </div>

        {/* Suggestions */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-4">
          <label
            className="block font-medium text-gray-800 mb-2"
            htmlFor="suggestions"
          >
            Do you have any suggestions for MAP? (Your opinions are valid and
            matter to us.)
          </label>
          <textarea
            id="suggestions"
            value={newMember.suggestions}
            onChange={(e) =>
              setNewMember({ ...newMember, suggestions: e.target.value })
            }
            placeholder="Your answer"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
          />
        </div>

        {/* Submit Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-4 flex justify-between items-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
          <button
            type="reset"
            onClick={() => setNewMember(defaultMemberState)}
            className="px-4 py-2 text-blue-600 hover:underline"
          >
            Clear form
          </button>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg text-center text-sm text-gray-600">
          Never submit passwords through this form.
        </div>
      </form>
    </div>
  );
}
