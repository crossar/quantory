import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { useUser } from "@/components/UserContext";
import useAuthRedirect from "@/hooks/useAuthRedirect";

export default function ProfilePage() {
  const [avatar, setAvatar] = useState(null);
  const { user, status } = useUser();
  useAuthRedirect();

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    const key = `avatar:${user.id}`;
    const savedAvatar = localStorage.getItem(key);
    if (savedAvatar) setAvatar(savedAvatar);
  }, [user?.id]);

  const initials = useMemo(() => {
    if (!user) return "";
    const a = (user.firstName || "").trim().charAt(0);
    const b = (user.lastName || "").trim().charAt(0);
    return (
      a + b || (user.username || user.email || "U").slice(0, 2)
    ).toUpperCase();
  }, [user]);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      setAvatar(dataUrl);
      localStorage.setItem(`avatar:${user.id}`, dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  if (status === "loading")
    return <p className="container">Loading profile...</p>;

  if (!user) return <p className="container">Redirecting to login...</p>;

  return (
    <div className="container">
      <div className="profile-simple-card">
        <div className="profile-photo">
          {avatar ? (
            <Image
              src={avatar}
              alt="Profile"
              width={96}
              height={96}
              unoptimized
            />
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
          <div className="profile-name">{user.name || "Unnamed user"}</div>
          <div className="profile-username">
            {user.username ? `@${user.username}` : user.email || "No email"}
          </div>
        </div>

        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}
