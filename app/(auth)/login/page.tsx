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

const page = () => {
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
          {/* <Navbar /> */}
          <div className="w-full h-[80vh] flex justify-center items-center">
            <div className=" w-full flex align-center justify-center">
              <form
                className="auth_form_container px-4 pt-10 pb-5 mx-auto shadow-md h-auto rounded-md"
                onSubmit={handleSubmit}
              >
                <h1 className="text-2xl mb-10 font-bold text-primaryDarkBlue">
                  Login
                </h1>
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

                <p className="text-green-500">
                  <Link href="forgotpassword">Forgot Password ?</Link>
                </p>

                <input
                  type="submit"
                  value="Login"
                  className="scaleable-btn w-[100px]"
                />

                <p className="text-slate-600 flex mt-5">
                  New to Invoice-Nest ?
                  <span className="text-green-500 underline ml-2 block cursor-pointer">
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

export default page;
