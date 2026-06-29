import { useEffect, useState } from "react";
import BottomNav from "./BottomNav";

export default function Layout({ children }) {
  const [notice, setNotice] = useState("");

  useEffect(() => {
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

    window.addEventListener("homeventory:notice", syncNotice);

    return () => {
      window.removeEventListener("homeventory:notice", syncNotice);
    };
  }, []);

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
        padding: "1rem",
        paddingBottom: "4rem",
        maxWidth: "600px",
        margin: "auto",
      }}
    >
      {notice ? (
        <div
          style={{
            marginBottom: "1rem",
            padding: "0.75rem 1rem",
            borderRadius: 10,
            background: "#fff3cd",
            color: "#6b4f00",
            border: "1px solid #f2d58a",
            display: "flex",
            gap: "0.75rem",
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <span>{notice}</span>
          <button
            type="button"
            onClick={dismissNotice}
            style={{
              border: 0,
              background: "transparent",
              color: "inherit",
              cursor: "pointer",
              fontSize: "1rem",
              lineHeight: 1,
            }}
            aria-label="Dismiss notice"
          >
            ×
          </button>
        </div>
      ) : null}
      {children}
      <BottomNav />
    </div>
  );
}
