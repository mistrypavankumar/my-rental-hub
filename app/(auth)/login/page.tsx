"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import AnimatedFormField from "@/components/animatedFormField/AnimatedFormField";
import Loader from "@/components/Loader";
import { loginUser } from "@/services/authServices";
import { loginSuccess, setLoading } from "@/redux/slices/authSlice";
import { showErrorMessage } from "@/lib/utils";

const Page = () => {
  const dispatch = useDispatch<AppDispatch>();

  const route = useRouter();
  const loading = false;

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please enter email and password");
      return;
    }

    try {
      const res = await loginUser(formData);

      dispatch(setLoading(true));

      if (res?.status === 200) {
        toast.success(res.data.message);
        dispatch(loginSuccess(res.data.user));

        route.replace(`/house`);

        setFormData({
          email: "",
          password: "",
        });
      }
    } catch (err) {
      showErrorMessage(err as Error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="w-full h-dvh flex justify-center items-center bg-[linear-gradient(90deg,rgba(0,0,0,0.9),rgba(0,0,0,0)),url('/assets/login_bg.jpg')] bg-cover bg-center bg-no-repeat">
            <div className=" w-full flex flex-col align-center justify-center">
              <div className="text-center mb-8 text-3xl md:text-4xl font-bold text-white hover:underline w-fit mx-auto">
                <Link href={"/"}>MyRental-Hub</Link>
              </div>
              <form
                className="auth_form_container px-4 py-5 pb-5 mx-auto shadow-md h-auto rounded-md bg-white/10 border-2 border-white/50 backdrop-blur-lg"
                onSubmit={handleSubmit}
              >
                <h1 className="text-2xl md:text-3xl mb-10 font-bold text-white">
                  Login
                </h1>
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

                <p className="text-white hover:underline">
                  <Link href="forgotpassword">Forgot Password ?</Link>
                </p>

                <input
                  type="submit"
                  value="Login"
                  className="scaleable-btn w-[100px] hover:text-white"
                />

                <p className="text-white flex mt-5">
                  New to Invoice-Nest ?
                  <span className="text-white underline ml-2 block cursor-pointer">
                    {" "}
                    <Link href="/register">Sign Up</Link>
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
