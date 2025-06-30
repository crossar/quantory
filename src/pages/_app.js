import '../styles/globals.css';
import Layout from '../components/Layout';
import { UserProvider } from '../components/UserContext'; 

export default function MyApp({ Component, pageProps }) {
  return (
    <UserProvider> {/* 👈 wrap the whole app */}
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </UserProvider>
  );
}
