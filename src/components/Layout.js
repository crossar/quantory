import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import BottomNav from "./BottomNav";
import { useUser } from "./UserContext";

const THEME_STORAGE_KEY = "quantory-theme";

export default function Layout({ children }) {
  const [notice, setNotice] = useState("");
  const [theme, setTheme] = useState("light");
  const router = useRouter();
  const { user, status } = useUser();

  const hideNavRoutes = ["/login", "/signup"];
  const isUnauthenticatedLanding =
    router.pathname === "/" && status !== "authenticated";
  const showBottomNav =
    !hideNavRoutes.includes(router.pathname) && !isUnauthenticatedLanding;

  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      const initialTheme =
        storedTheme === "light" || storedTheme === "dark"
          ? storedTheme
          : systemTheme;

      setTheme(initialTheme);
    } catch {
      setTheme("light");
    }

    const readNotice = () => {
      try {
        return (
          sessionStorage.getItem("appNotice") ||
          sessionStorage.getItem("authNotice") ||
          ""
        );
      } catch {
        return "";
      }
    };

    const syncNotice = () => {
      setNotice(readNotice());
    };

    syncNotice();

    window.addEventListener("quantory:notice", syncNotice);

    return () => {
      window.removeEventListener("quantory:notice", syncNotice);
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.style.colorScheme = theme;

    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {}

    const themeColor = theme === "dark" ? "#0b1020" : "#f8fbfe";
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute("content", themeColor);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };

  const dismissNotice = () => {
    setNotice("");

    try {
      sessionStorage.removeItem("appNotice");
      sessionStorage.removeItem("authNotice");
    } catch {}
  };

  return (
    <div
      style={{
        width: "min(100%, 1120px)",
        padding: "1rem",
        paddingBottom: "4rem",
        margin: "auto",
      }}
    >
      <button
        type="button"
        onClick={toggleTheme}
        className="theme-toggle"
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      >
        {theme === "dark" ? "☀ Light" : "☾ Dark"}
      </button>

      {user?.isDemo ? (
        <div className="demo-banner">
          Demo Mode – Changes are temporary and reset periodically.
        </div>
      ) : null}

      {notice ? (
        <div className="notice-banner">
          <span>{notice}</span>
          <button
            type="button"
            onClick={dismissNotice}
            className="notice-dismiss"
            aria-label="Dismiss notice"
          >
            ×
          </button>
        </div>
      ) : null}
      {children}
      {showBottomNav ? <BottomNav /> : null}
    </div>
  );
}
