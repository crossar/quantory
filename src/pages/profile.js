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
    router.push("/login");
  };

  if (!user) return <p>Loading profile...</p>;

  return (
    <div className="profile-container">
      <h1>Your Profile</h1>
      <div className="profile-card">
        <div className="profile-info">
          <p>
            <strong>Full Name:</strong> {user.firstName || "N/A"}{" "}
            {user.lastName || ""}
          </p>
          <p>
            <strong>Username:</strong> {user.username || "N/A"}
          </p>
        </div>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}
