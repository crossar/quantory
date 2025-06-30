import useAuthRedirect from "../hooks/useAuthRedirect";
import ExpiringSoonPage from '../components/ExpiringSoonPage';
import BottomNav from '../components/BottomNav';

export default function Expiring() {
  useAuthRedirect();
  return (
    <>
      <ExpiringSoonPage />
      <BottomNav />
    </>
  );
}
