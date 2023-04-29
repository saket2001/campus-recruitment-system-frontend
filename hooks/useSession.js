import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { authActions } from "../store/authSlice";

export const useSession = () => {
  const dispatch = useDispatch();

  const token = globalThis.window?.sessionStorage?.getItem("auth-token");
  const code = globalThis.window?.sessionStorage?.getItem("code");
  const full_name = globalThis.window?.sessionStorage?.getItem("full_name");
  const user_id = globalThis.window?.sessionStorage?.getItem("user_id");

  if (token === undefined || token ==="undefined") {
    dispatch(authActions.toggleLogin(false));
    return;
  }
  useEffect(() => {
    if (token && token.length > 0) {
      dispatch(authActions.updateToken(token));
      dispatch(authActions.updateCode(code));
      dispatch(authActions.updateName(full_name));
      dispatch(authActions.updateUserID(user_id));
      dispatch(authActions.toggleLogin(true));
    }
  }, []);
};
