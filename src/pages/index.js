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
        <div className="auth-page">
          <div className="auth-shell">
            <div className="auth-grid auth-grid-2up">
              <section className="auth-hero">
                <div>
                  <h1 style={{ marginBottom: "0.6rem" }}>Homeventory</h1>
                  <p className="auth-copy">
                    Explore the full app instantly with demo data, or create an
                    account to save your own inventory.
                  </p>
                </div>

                <div className="auth-points">
                  <div className="auth-point">
                    Track fridge, freezer, pantry, storage, household, and
                    medicine items.
                  </div>
                  <div className="auth-point">
                    Demo data is preloaded and resets periodically.
                  </div>
                  <div className="auth-point">
                    Real accounts keep your saved data private and persistent.
                  </div>
                </div>
              </section>

              <section className="auth-card">
                <div style={{ marginBottom: "1rem" }}>
                  <h2>Get started</h2>
                  <p className="auth-note">
                    Choose demo mode for a quick tour, or create an account for
                    your own data.
                  </p>
                </div>

                {error ? <div className="auth-error">{error}</div> : null}

                <div className="auth-form">
                  <button
                    type="button"
                    onClick={handleTryDemo}
                    disabled={demoLoading}
                    className="auth-button auth-button-primary"
                  >
                    {demoLoading ? "Starting Demo..." : "Try Demo"}
                  </button>

                  <Link
                    href="/signup"
                    className="auth-button auth-button-secondary"
                    style={{ textAlign: "center" }}
                  >
                    Create Account
                  </Link>

                  <Link
                    href="/login"
                    className="auth-button auth-button-tertiary"
                    style={{ textAlign: "center" }}
                  >
                    Log In
                  </Link>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
