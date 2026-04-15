import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";

// Import CSS files directly
import "../admin/css/all.css";
import "../admin/css/animation.css";
import "../admin/css/bootstrap.min.css";
import "../admin/css/custom.css";
import "../admin/css/datepicker.css";
import "../admin/css/responsive.css";
import "../admin/css/style.css";

export default function UserLayout() {
  useEffect(() => {
    const jsFiles = [
      "/admin/js/jquery.js",
      "/admin/js/bootstrap.min.js",
      "/admin/js/custom.js",
      "/admin/js/animation.js",
      "/admin/js/datepicker.js",
    ];

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
    <div>
      {/* <h2>Admin Panel</h2> */}
      <Outlet />
    </div>
  );
}
