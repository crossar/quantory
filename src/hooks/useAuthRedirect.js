import { useEffect } from "react";
import { useRouter } from "next/router";
import { useUser } from "@/components/UserContext";

export default function useAuthRedirect() {
  const router = useRouter();
  const { status } = useUser();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [router, status]);

  return status;
}
