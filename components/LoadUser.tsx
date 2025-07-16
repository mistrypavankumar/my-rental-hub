"use client";

import { PUBLIC_ROUTES } from "@/lib/constants";
import { loadUser, logout, setLoading } from "@/redux/slices/authSlice";
import { AppDispatch, RootState } from "@/redux/store";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "./Loader";

const LoadUser = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();

  const dispatch = useDispatch<AppDispatch>();

  const { loading, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchUser = async () => {
      dispatch(setLoading(true));
      try {
        const res = await axios.get("/api/v1/user/me", {
          withCredentials: true,
        });

        if (res.status === 200) {
          dispatch(loadUser(res.data.user));
        }
      } catch (err) {
        console.error("Error loading user:", err);
        dispatch(logout());
        if (!PUBLIC_ROUTES.includes(pathname)) {
          router.replace("/login");
        }
      } finally {
        dispatch(setLoading(true));
        setTimeout(() => {
          dispatch(setLoading(false));
        }, 1000);
      }
    };

    if (!user) {
      fetchUser();
    }
  }, [pathname, user, dispatch, router]);

  if (loading) return <Loader />;

  return <>{children}</>;
};

export default LoadUser;
