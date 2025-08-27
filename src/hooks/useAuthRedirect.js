import { useEffect } from "react";
import { useRouter } from "next/router";

function getUserSafe() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

export default function useAuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    const user = getUserSafe();
    if (!user) {
      router.replace("/login");
    }
  }, [router]);
}
