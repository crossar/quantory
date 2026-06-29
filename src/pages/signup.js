import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";

export default function SignupPage() {
  const [form, setForm] = useState({
    email: "",
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
        email: form.email.trim().toLowerCase(),
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
    <form onSubmit={handleSubmit}>
      <h1>Sign Up</h1>
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
        name="firstName"
        placeholder="First Name"
        value={form.firstName}
        onChange={handleChange}
        required
      />
      <input
        name="lastName"
        placeholder="Last Name"
        value={form.lastName}
        onChange={handleChange}
        required
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        required
      />
      <button type="submit" disabled={submitting}>
        {submitting ? "Creating..." : "Sign Up"}
      </button>
      {googleEnabled ? (
        <button type="button" onClick={handleGoogleSignIn}>
          Continue with Google
        </button>
      ) : null}
    </form>
  );
}
