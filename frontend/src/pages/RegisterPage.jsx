import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import useAuthStore from "../store/authStore";

function RegisterPage() {
  const navigate = useNavigate();

  const { register, loading } = useAuthStore();

  const [formData, setFormData] = useState({
    name: "",

    email: "",

    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await register(formData);

      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
      {/* BACKGROUND GLOW */}

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-120px] left-[-120px] w-96 h-96 bg-blue-500/20 blur-3xl rounded-full" />

        <div className="absolute bottom-[-120px] right-[-120px] w-96 h-96 bg-cyan-500/20 blur-3xl rounded-full" />
      </div>

      {/* CARD */}

      <div className="glass w-full max-w-md rounded-[32px] p-8 relative z-10 shadow-2xl">
        {/* LOGO */}

        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="text-2xl font-bold">Q</span>
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight">QuicKey</h1>

            <p className="text-zinc-400 text-sm">Locksmith Intelligence</p>
          </div>
        </div>

        {/* HEADER */}

        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Create Account</h2>

          <p className="text-zinc-400 mt-2 text-sm">
            Start using QuicKey Intelligence today.
          </p>
        </div>

        {/* FORM */}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* NAME */}

          <div>
            <label className="text-sm text-zinc-400 mb-2 block">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full bg-white/[0.04] border border-white/10 focus:border-cyan-400/50 outline-none rounded-2xl px-5 py-4 text-white placeholder:text-zinc-500 transition-all"
            />
          </div>

          {/* EMAIL */}

          <div>
            <label className="text-sm text-zinc-400 mb-2 block">Email</label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full bg-white/[0.04] border border-white/10 focus:border-cyan-400/50 outline-none rounded-2xl px-5 py-4 text-white placeholder:text-zinc-500 transition-all"
            />
          </div>

          {/* PASSWORD */}

          <div>
            <label className="text-sm text-zinc-400 mb-2 block">Password</label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              className="w-full bg-white/[0.04] border border-white/10 focus:border-cyan-400/50 outline-none rounded-2xl px-5 py-4 text-white placeholder:text-zinc-500 transition-all"
            />
          </div>

          {/* BUTTON */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:scale-[1.02] active:scale-95 transition-all duration-200 py-4 rounded-2xl font-semibold shadow-lg shadow-cyan-500/20 disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* FOOTER */}

        <p className="text-sm text-zinc-400 text-center mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-cyan-400 hover:text-cyan-300">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
