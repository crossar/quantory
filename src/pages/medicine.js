import useAuthRedirect from "../hooks/useAuthRedirect";
import InventoryPage from '../components/InventoryPage';

export default function MedicinePage() {
  useAuthRedirect();
  return <InventoryPage title="Medicine Inventory" location="medicine" />;
}
