import { useEffect } from "react";
import { useRouter } from "next/router";

/** Safe localStorage reader */
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
      router.replace("/login"); // redirect to login if not found
    }
  }, [router]);
}
