import { useState } from "react";

import { useNavigate } from "react-router-dom";

import useAuthStore from "../store/authStore";

function RegisterPage() {
  const navigate = useNavigate();

  const { register, loading } =
    useAuthStore();

  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      password: "",
    });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
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
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 p-8 rounded-2xl w-full max-w-md flex flex-col gap-4"
      >
        <h1 className="text-3xl font-bold">
          Register
        </h1>

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="p-3 rounded-lg bg-zinc-800 outline-none"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="p-3 rounded-lg bg-zinc-800 outline-none"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="p-3 rounded-lg bg-zinc-800 outline-none"
        />

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 p-3 rounded-lg"
        >
          {loading
            ? "Loading..."
            : "Register"}
        </button>
      </form>
    </div>
  );
}

export default RegisterPage;