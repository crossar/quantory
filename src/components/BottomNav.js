import { useRouter } from "next/router";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useUser } from "./UserContext";

export default function BottomNav() {
  const router = useRouter();
  const current = router.pathname;

  const { user, status } = useUser();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  const greetingName =
    user?.firstName ||
    user?.name?.split(" ")[0] ||
    user?.username ||
    user?.email ||
    "";

  const links = [
    { href: "/", label: "🏠 Home" },
    { href: "/expiring", label: "⚠ Expiring" },
    { href: "/to-buy", label: "🛒 To Buy" },
    { href: "/profile", label: "👤 Profile" },
  ];

  // ✅ Only show top-right greeting/logout if NOT on profile page
  const showTopRight = current !== "/profile";

  return (
    <>
      {showTopRight && (
        <div style={topRightStyle}>
          {user ? (
            <>
              <span
                style={{
                  marginRight: "0.5rem",
                  color: "var(--text-secondary)",
                }}
              >
                Hi, {greetingName}
              </span>
              <button onClick={handleLogout} className="nav-small-button">
                Logout
              </button>
            </>
          ) : status !== "loading" ? (
            <Link href="/" className="nav-small-link">
              Login
            </Link>
          ) : null}
        </div>
      )}

      <nav style={navStyle}>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            style={{
              ...linkStyle,
              fontWeight: current === link.href ? "bold" : "normal",
            }}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </>
  );
}

const topRightStyle = {
  position: "fixed",
  top: "10px",
  right: "10px",
  fontSize: "0.8rem",
  zIndex: 1001,
};

const navStyle = {
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center",
  background: "var(--background-elevated)",
  padding: "0.75rem 0",
  borderTop: "1px solid var(--border-color)",
  fontSize: "0.9rem",
  zIndex: 1000,
  boxShadow: "0 -10px 24px rgba(15, 23, 42, 0.05)",
};

const linkStyle = {
  textDecoration: "none",
  color: "var(--text-secondary)",
  flex: 1,
  textAlign: "center",
  transition: "color 140ms ease",
};
