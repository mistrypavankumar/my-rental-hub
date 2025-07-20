"use client";

import React, { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { registerUser } from "@/services/authServices";
import Loader from "@/components/Loader/Loader";
import AnimatedFormField from "@/components/animatedFormField/AnimatedFormField";
import { showErrorMessage } from "@/lib/utils";

const Page = () => {
  const loading = false;
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const res = await registerUser(formData);

      if (res?.status === 201) {
        toast.success(res.data.message);

        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });

        router.push("/login");
      }
    } catch (err) {
      showErrorMessage(err as Error);
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="w-full h-dvh flex justify-center items-center bg-[linear-gradient(90deg,rgba(0,0,0,0.9),rgba(0,0,0,0)),url('/assets/register_bg.jpg')] bg-center bg-cover bg-no-repeat">
            <div className=" w-full flex flex-col align-center justify-center">
              <div className="text-center mb-8 text-3xl md:text-4xl font-bold text-white hover:underline w-fit mx-auto">
                <Link href={"/"}>MyRental-Hub</Link>
              </div>
              <form
                className="auth_form_container px-4 py-5 pb-5 mx-auto shadow-md h-auto rounded-md backdrop-blur-lg bg-white/10 border-2 border-white/50"
                onSubmit={handleSubmit}
                encType="form-data"
              >
                <h1 className="text-2xl md:text-3xl mb-10 font-bold text-white">
                  Sign Up
                </h1>
                <AnimatedFormField
                  value={formData.name}
                  onChange={handleChange}
                  inputType="text"
                  placeholder="Enter your name"
                  name="name"
                />
                <AnimatedFormField
                  value={formData.email}
                  onChange={handleChange}
                  inputType="email"
                  placeholder="Enter your email"
                  name="email"
                />
                <AnimatedFormField
                  value={formData.password}
                  onChange={handleChange}
                  inputType="password"
                  placeholder="Enter your password"
                  name="password"
                />
                <AnimatedFormField
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  inputType="password"
                  placeholder="Confirm your password"
                  name="confirmPassword"
                />

                <input
                  type="submit"
                  value="Sign Up"
                  className="scaleable-btn w-[100px] hover:text-white"
                />

                <p className="text-white flex mt-5">
                  Already have an account?
                  <span className="text-white underline ml-2 block cursor-pointer">
                    {" "}
                    <Link href="/login">Login</Link>
                  </span>
                </p>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Page;
