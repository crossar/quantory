import { createContext, useContext } from "react";
import { useSession } from "next-auth/react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const { data: session, status } = useSession();
  const user = session?.user ?? null;

  return (
    <UserContext.Provider value={{ user, status }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
