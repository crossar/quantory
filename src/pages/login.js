import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const { status: authStatus } = useSession();
  const googleEnabled = process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === "true";

  useEffect(() => {
    if (authStatus === "authenticated") {
      router.replace("/");
    }
  }, [authStatus, router]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });
    setSubmitting(true);

    try {
      const result = await signIn("credentials", {
        username: form.username.trim().toLowerCase(),
        password: form.password,
        redirect: false,
      });

      if (result?.error) {
        setStatus({ type: "error", message: "Invalid username or password" });
        return;
      }

      router.push("/");
    } catch {
      setStatus({ type: "error", message: "Login failed" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    await signIn("google", { callbackUrl: "/" });
  };

  return (
    <div className="auth-page">
      <div className="auth-shell" style={{ maxWidth: 560 }}>
        <section className="auth-card">
          <div style={{ marginBottom: "1rem" }}>
            <span className="auth-kicker">Welcome back</span>
            <h1 style={{ marginTop: "0.5rem" }}>Log In</h1>
            <p className="auth-note">
              Use your existing account to keep your inventory saved between
              sessions.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {status.message ? (
              <div className="auth-error">{status.message}</div>
            ) : null}
            <input
              className="auth-field"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Username"
            />
            <input
              className="auth-field"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
            />
            <button
              type="submit"
              disabled={submitting}
              className="auth-button auth-button-primary"
            >
              {submitting ? "Signing in..." : "Login"}
            </button>
            {googleEnabled ? (
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="auth-button auth-button-secondary"
              >
                Continue with Google
              </button>
            ) : null}
            <p className="auth-link-row">
              Don’t have an account? <Link href="/signup">Sign up</Link>
            </p>
          </form>
        </section>
      </div>
    </div>
  );
}
