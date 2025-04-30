import React, { useState } from "react";
import { FiLoader } from "react-icons/fi";
import { supabase } from "../lib/supabase";
import { toast, Toaster } from "sonner";
import { MdErrorOutline } from "react-icons/md";
import { CiCircleCheck } from "react-icons/ci";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { email, password } = formData;
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        toast.error(error.message, {
          icon: <MdErrorOutline size={20} color="#FF3B30" />,
        });
      } else {
        toast.success("Login successful", {
          icon: <CiCircleCheck size={20} color="#01BF5B" />,
        });
        navigate("/overview");
      }
    } catch (err) {
      toast.error("An enexpected error occured");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#EBF4FF] p-4">
      <Toaster position="top-right" />
      <header className=" flex items-center justify-between h-15 text-black">
        <img src="/images/logo.png" className="w-12 h-12 mb-2" alt="logo" />
        <span className="font-semibold">Admin</span>
      </header>

      <section className="flex items-center justify-center h-[calc(100vh-3.75rem)] px-6">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-[26rem] mx-auto   text-black bg-white p-4 rounded-md auth-form-shadow"
        >
          <img
            src="/images/logo.png"
            className="mx-auto w-12 h-12 mb-2"
            alt="logo"
          />
          <p className="text-center mb-8 font-semibold">Welcome Admin!</p>

          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <label>Email</label>
              <input
                autoComplete="on"
                required
                type="email"
                name="email"
                placeholder="e.g timi@gmail.com"
                className="border  rounded-sm p-2 placeholder:text-sm"
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="password"
                className="border  rounded-sm p-2 placeholder:text-sm"
                onChange={handleChange}
                required
              />
            </div>

            <button
              disabled={!formData.email || !formData.password}
              type="submit"
              className=" flex items-center gap-4 justify-center p-2 rounded-sm bg-[#0052a6] text-white cursor-pointer  disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? (
                <FiLoader className="w-6 h-6 text-white animate-spin" />
              ) : (
                "Login"
              )}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default Login;
