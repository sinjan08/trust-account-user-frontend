import { useEffect } from "react";
import { Outlet } from "react-router-dom";

export default function UserLayout() {
  useEffect(() => {
    const cssFiles = [
      "../superAdmin/css/animation.css",
      "../superAdmin/css/bootstrap.min.css",
      "../superAdmin/css/custom.css",
      "../superAdmin/css/datepicker.css",
      "../superAdmin/css/responsive.css",
      "../superAdmin/css/style.css",
    ];

    const jsFiles = ["/superAdmin/js/common.js"];

    const links = cssFiles.map((href) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      document.head.appendChild(link);
      return link;
    });

    const scripts = jsFiles.map((src) => {
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      document.body.appendChild(script);
      return script;
    });

    return () => {
      links.forEach((link) => document.head.removeChild(link));
      scripts.forEach((script) => document.body.removeChild(script));
    };
  }, []);

  return <Outlet />;
}
