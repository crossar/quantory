import { useEffect } from "react";
import { useRouter } from "next/router";

export default function useAuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      router.replace("/login"); // redirect to login if not found
    }
  }, []);
}
