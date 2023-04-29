import { useSession } from "../hooks/useSession";
import React from "react";
import { useSelector } from "react-redux";

export const useAuthCheck = () => {
  useSession();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  return isLoggedIn;
};
