import { useState, useEffect } from "react";

const getScreenWidth = (w) => {
  if (window) {
    const size = +w?.screen?.availWidth;
    return size;
  }
};

export const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState(1820);

  useEffect(() => {
    // setScreenSize(() => getScreenWidth(window));
    window.addEventListener("resize", () => {
      setScreenSize(() => getScreenWidth(window));
    });

    return window.removeEventListener('resize',()=>{});
  });

  return screenSize;
};
