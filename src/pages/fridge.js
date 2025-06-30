import useAuthRedirect from "../hooks/useAuthRedirect";
import InventoryPage from '../components/InventoryPage';

export default function FridgePage() {
  useAuthRedirect();
  return <InventoryPage title="Fridge Inventory" location="fridge" />;
}
