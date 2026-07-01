import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";

export default function SignupPage() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
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
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus({ type: "error", message: data.error || "Signup failed" });
        return;
      }

      const result = await signIn("credentials", {
        username: form.username.trim().toLowerCase(),
        password: form.password,
        redirect: false,
      });

      if (result?.error) {
        setStatus({
          type: "error",
          message:
            "Account created, but automatic sign-in failed. Please log in.",
        });
        router.push("/login");
        return;
      }

      router.push("/");
    } catch {
      setStatus({ type: "error", message: "Signup failed" });
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
            <span className="auth-kicker">Create your workspace</span>
            <h1 style={{ marginTop: "0.5rem" }}>Sign Up</h1>
            <p className="auth-note">
              Create a personal account so your inventory stays saved under your
              own login.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {status.message ? (
              <div className="auth-error">{status.message}</div>
            ) : null}
            <input
              className="auth-field"
              name="firstName"
              placeholder="First Name"
              value={form.firstName}
              onChange={handleChange}
              required
            />
            <input
              className="auth-field"
              name="lastName"
              placeholder="Last Name"
              value={form.lastName}
              onChange={handleChange}
              required
            />
            <input
              className="auth-field"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              required
            />
            <input
              className="auth-field"
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <button
              type="submit"
              disabled={submitting}
              className="auth-button auth-button-primary"
            >
              {submitting ? "Creating..." : "Sign Up"}
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
              Already have an account? <Link href="/login">Log in</Link>
            </p>
          </form>
        </section>
      </div>
    </div>
  );
}
