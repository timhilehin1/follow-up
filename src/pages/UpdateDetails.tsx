import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { toast, Toaster } from "sonner";
import { MdErrorOutline } from "react-icons/md";

export default function UpdateDetails() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    emergencyContact: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.fullName || !form.email || !form.emergencyContact) return;

    if (!isValidEmail(form.email)) {
      toast.error("Please enter a valid email address", {
        icon: <MdErrorOutline size={20} color="#FF3B30" />,
      });
      return;
    }

    setIsSubmitting(true);
    const normalizedEmail = form.email.toLowerCase().trim();

    try {
      const { data: existing, error: fetchError } = await supabase
        .from("members")
        .select("id")
        .eq("email", normalizedEmail)
        .limit(1);

      if (fetchError) throw fetchError;

      if (!existing || existing.length === 0) {
        toast.error(
          "We couldn't find your email in our records. Please fill in the full registration form.",
          { icon: <MdErrorOutline size={20} color="#FF3B30" /> }
        );
        setTimeout(() => navigate("/new"), 3000);
        return;
      }

      const { error: updateError } = await supabase
        .from("members")
        .update({ emergency_contact: form.emergencyContact })
        .eq("email", normalizedEmail);

      if (updateError) throw updateError;

      setIsSubmitted(true);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.", {
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
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
      Thank you for updating your records!
          </h2>
          <p className="text-gray-600">
            Your emergency contact has been saved successfully. We appreciate
            you keeping your details up to date.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto pb-10">
      <Toaster position="top-right" />

      <div className="bg-blue-600 text-white p-6 rounded-t-lg border-b-8 border-blue-800">
        <h1 className="text-2xl font-bold">CHEMIST MAP — UPDATE YOUR DETAILS</h1>
        <p className="mt-2">
          Fill in your email and emergency contact below. If your email is
          already in our records, we'll update your details right away.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            required
            placeholder="Your answer"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            placeholder="johndoe@gmail.com"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Emergency Contact */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-4">
          <label
            className="block font-medium text-gray-800 mb-2"
            htmlFor="emergencyContact"
          >
            Emergency Contact <span className="text-red-500">*</span>
            <span className="block text-sm font-normal text-gray-500 mt-1">
              A person we can reach if you are not available
            </span>
          </label>
          <input
            id="emergencyContact"
            type="tel"
            value={form.emergencyContact}
            onChange={(e) =>
              setForm({ ...form, emergencyContact: e.target.value })
            }
            required
            placeholder="phone number"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit */}
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
            onClick={() =>
              setForm({ fullName: "", email: "", emergencyContact: "" })
            }
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
