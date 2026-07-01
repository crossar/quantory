import Link from "next/link";
import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";

export default function Home() {
  const router = useRouter();
  const { status } = useSession();
  const [demoLoading, setDemoLoading] = useState(false);
  const [error, setError] = useState("");

  const data = [
    { name: "Fridge", href: "/fridge" },
    { name: "Freezer", href: "/freezer" },
    { name: "Pantry", href: "/pantry" },
    { name: "Storage Room", href: "/storage-room" },
    { name: "Household", href: "/household" },
    { name: "Medicine", href: "/medicine" },
  ];

  const handleTryDemo = async () => {
    setError("");
    setDemoLoading(true);

    try {
      const result = await signIn("demo", {
        redirect: false,
        callbackUrl: "/",
      });

      if (result?.error) {
        setError("Unable to start demo mode. Please try again.");
        return;
      }

      router.push(result?.url || "/");
    } catch {
      setError("Unable to start demo mode. Please try again.");
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Home Inventory</title>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </Head>

      {status === "authenticated" ? (
        <div className="container">
          <h1>Inventory</h1>
          <div className="card-list">
            {data.map((item) => (
              <Link key={item.name} href={item.href} className="card">
                {item.name} →
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div
          className="container"
          style={{ maxWidth: 720, paddingTop: "3rem" }}
        >
          <h1 style={{ marginBottom: "0.5rem" }}>Homeventory</h1>
          <p style={{ marginBottom: "1.5rem", color: "#444" }}>
            Explore the full app instantly with demo data, or create an account
            to save your own inventory.
          </p>

          {error ? (
            <div
              style={{
                marginBottom: "1rem",
                padding: "0.75rem 1rem",
                borderRadius: 10,
                background: "#fdecea",
                color: "#9b1c1c",
                border: "1px solid #f5c2c7",
              }}
            >
              {error}
            </div>
          ) : null}

          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            <button
              type="button"
              onClick={handleTryDemo}
              disabled={demoLoading}
              style={{
                width: "100%",
                padding: "0.8rem 1rem",
                fontSize: "1rem",
              }}
            >
              {demoLoading ? "Starting Demo..." : "Try Demo"}
            </button>

            <Link
              href="/signup"
              className="card"
              style={{ textAlign: "center", fontWeight: 600 }}
            >
              Create Account
            </Link>

            <Link
              href="/login"
              className="card"
              style={{ textAlign: "center", fontWeight: 500 }}
            >
              Log In
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
