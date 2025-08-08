import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (!saved) {
      router.push("/login");
      return;
    }
    const u = JSON.parse(saved);
    setUser(u);

    // load saved avatar (per-username)
    const key = `avatar:${u.username}`;
    const savedAvatar = localStorage.getItem(key);
    if (savedAvatar) setAvatar(savedAvatar);
  }, [router]);

  const initials = useMemo(() => {
    if (!user) return "";
    const a = (user.firstName || "").trim().charAt(0);
    const b = (user.lastName || "").trim().charAt(0);
    return (a + b || (user.username || "U").slice(0, 2)).toUpperCase();
  }, [user]);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      setAvatar(dataUrl);
      localStorage.setItem(`avatar:${user.username}`, dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (!user) return <p className="container">Loading profile...</p>;

  return (
    <div className="container">
      <div className="profile-simple-card">
        <div className="profile-photo">
          {avatar ? (
            <img src={avatar} alt="Profile" />
          ) : (
            <span aria-hidden="true">{initials}</span>
          )}
          <label className="change-photo-btn">
            Change photo
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              hidden
            />
          </label>
        </div>

        <div className="profile-simple-info">
          <div className="profile-name">
            {user.firstName || "N/A"} {user.lastName || ""}
          </div>
          <div className="profile-username">@{user.username || "N/A"}</div>
        </div>

        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}
