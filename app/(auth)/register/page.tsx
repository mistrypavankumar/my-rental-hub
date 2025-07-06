"use client";

import React, { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { registerUser } from "@/services/authServices";
import Loader from "@/components/Loader";
import AnimatedFormField from "@/components/animatedFormField/AnimatedFormField";
import { showErrorMessage } from "@/lib/utils";

const page = () => {
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
          {/* <Navbar /> */}
          <div className="w-full h-[80vh] flex justify-center items-center">
            <div className=" w-full flex align-center justify-center">
              <form
                className="auth_form_container px-4 pt-8 pb-5 mx-auto shadow-md h-auto rounded-md"
                onSubmit={handleSubmit}
                encType="form-data"
              >
                <h1 className="text-2xl mb-10 font-bold text-primaryDarkBlue">
                  Sign Up
                </h1>
                <AnimatedFormField
                  value={formData.name}
                  onChange={handleChange}
                  inputType="text"
                  labelName="Name"
                  name="name"
                />
                <AnimatedFormField
                  value={formData.email}
                  onChange={handleChange}
                  inputType="email"
                  labelName="Email"
                  name="email"
                />
                <AnimatedFormField
                  value={formData.password}
                  onChange={handleChange}
                  inputType="password"
                  labelName="Password"
                  name="password"
                />
                <AnimatedFormField
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  inputType="password"
                  labelName="Confirm Password"
                  name="confirmPassword"
                />

                <input
                  type="submit"
                  value="Sign Up"
                  className="scaleable-btn w-[100px]"
                />

                <p className="text-slate-600 flex mt-5">
                  Already have an account?
                  <span className="text-green-500 underline ml-2 block cursor-pointer">
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

export default page;
