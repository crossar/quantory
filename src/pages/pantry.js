import useAuthRedirect from "../hooks/useAuthRedirect";
import InventoryPage from '../components/InventoryPage';

export default function PantryPage() {
  useAuthRedirect();
  return <InventoryPage title="Pantry Inventory" location="pantry" />;
}
