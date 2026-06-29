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
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      {status.message ? (
        <div
          style={{
            marginBottom: "1rem",
            padding: "0.75rem 1rem",
            borderRadius: 10,
            background: status.type === "error" ? "#fdecea" : "#edf7ed",
            color: status.type === "error" ? "#9b1c1c" : "#1f5f3a",
            border:
              status.type === "error"
                ? "1px solid #f5c2c7"
                : "1px solid #badbcc",
          }}
        >
          {status.message}
        </div>
      ) : null}
      <input
        name="username"
        value={form.username}
        onChange={handleChange}
        placeholder="Username"
      />
      <input
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Password"
      />
      <button type="submit" disabled={submitting}>
        {submitting ? "Signing in..." : "Login"}
      </button>
      {googleEnabled ? (
        <button type="button" onClick={handleGoogleSignIn}>
          Continue with Google
        </button>
      ) : null}
      <p style={{ marginTop: "10px" }}>
        Don’t have an account? <Link href="/signup">Sign up</Link>
      </p>
    </form>
  );
}
