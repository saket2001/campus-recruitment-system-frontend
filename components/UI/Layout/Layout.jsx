import React from "react";
import { FooterUI } from "../FooterUI/FooterUI";
import { NavBar } from "../NavBar/NavBar";
import { useSession } from "../../../hooks/useSession";

export const Layout = ({ children, showNav = true, showAuth, bgColor, textColor }) => {
  useSession();
  return (
    <>
      {showNav && (
        <NavBar showAuth={showAuth} bgColor={bgColor} textColor={textColor} />
      )}
      <div className="relative h-full">{children}</div>
      {showNav && <FooterUI />}
    </>
  );
};
