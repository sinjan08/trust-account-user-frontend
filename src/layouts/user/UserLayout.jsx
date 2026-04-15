import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";

// Import CSS files directly
import "../user/css/animation.css";
import "../user/css/bootstrap.min.css";
import "../user/css/dashboard.css";
import "../user/css/slick.css";
import "../user/css/style.css";
import UserSidebar from "../../components/sidebar/UserSidebar"

export default function UserLayout() {
  useEffect(() => {
    // console.log("CSS and JS loaded via imports");

    const jsFiles = ["../user/js/common.js"];

    // Dynamically load JS (no CSS needed as it's imported)
    const loadJS = (src) => {
      const existingScript = document.querySelector(`script[src="${src}"]`);
      if (!existingScript) {
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        document.body.appendChild(script);
      }
    };

    jsFiles.forEach(loadJS);

    return () => {
      jsFiles.forEach((src) => {
        const script = document.querySelector(`script[src="${src}"]`);
        if (script) document.body.removeChild(script);
      });
    };
  }, []);

  return (
    <>
      <UserSidebar />
      <Outlet />
    </>
  );
}
