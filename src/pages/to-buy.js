import useAuthRedirect from "../hooks/useAuthRedirect";
import ToBuyPage from "../components/ToBuyPage";
import BottomNav from "../components/BottomNav";

export default function ToBuy() {
  useAuthRedirect();
  return (
    <>
      <ToBuyPage />
      <BottomNav />
    </>
  );
}
