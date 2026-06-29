import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import Layout from "../components/Layout";
import { UserProvider } from "../components/UserContext";

export default function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session} refetchOnWindowFocus={false}>
      <UserProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </UserProvider>
    </SessionProvider>
  );
}
