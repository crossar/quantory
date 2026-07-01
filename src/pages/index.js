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
        <div className="landing-page">
          <div className="landing-shell">
            <header className="landing-hero">
              <p className="landing-eyebrow">Homeventory</p>
              <h1 className="landing-title">
                Organize your home inventory with clarity.
              </h1>
              <p className="landing-subtitle">
                Manage pantry, freezer, fridge, storage, household, medicine,
                and shopping lists in one clean workspace.
              </p>
            </header>

            <div className="landing-grid">
              <section className="landing-card landing-info-card">
                <div className="landing-card-header">
                  <h2>Everything you need in one place</h2>
                  <p>
                    Built for day-to-day household tracking with a simple,
                    reliable workflow.
                  </p>
                </div>

                <div className="landing-feature-grid">
                  <article className="landing-feature-card">
                    <h3>Unified Categories</h3>
                    <p>
                      Track fridge, freezer, pantry, storage, household, and
                      medicine items with consistent structure.
                    </p>
                  </article>
                  <article className="landing-feature-card">
                    <h3>Demo Exploration</h3>
                    <p>
                      Instantly explore the full experience with pre-populated
                      sample data.
                    </p>
                  </article>
                  <article className="landing-feature-card">
                    <h3>Personal Accounts</h3>
                    <p>
                      Keep your own inventory private and persistent across
                      sessions and devices.
                    </p>
                  </article>
                </div>
              </section>

              <section className="landing-card landing-cta-card">
                <div className="landing-card-header">
                  <h2>Get Started</h2>
                  <p>
                    Choose demo mode for a quick tour, or create an account for
                    your own saved data.
                  </p>
                </div>

                {error ? <div className="auth-error">{error}</div> : null}

                <div className="landing-actions">
                  <button
                    type="button"
                    onClick={handleTryDemo}
                    disabled={demoLoading}
                    className="auth-button landing-btn landing-btn-primary"
                  >
                    {demoLoading ? "Starting Demo..." : "Try Demo"}
                  </button>

                  <Link
                    href="/signup"
                    className="auth-button landing-btn landing-btn-secondary"
                  >
                    Create Account
                  </Link>

                  <Link
                    href="/login"
                    className="auth-button landing-btn landing-btn-tertiary"
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
