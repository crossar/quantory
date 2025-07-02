import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      setUser(JSON.parse(saved));
    } else {
      router.push("/login"); // redirect if not logged in
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login"); // go to login after logout
  };

  if (!user) return <p>Loading profile...</p>;

  return (
    <div className="container">
      <h1>Profile</h1>
      <p>
        <strong>Username:</strong> {user.username}
      </p>
      {user.firstName && (
        <p>
          <strong>Full Name:</strong> {user.firstName} {user.lastName}
        </p>
      )}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
