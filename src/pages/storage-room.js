import useAuthRedirect from "../hooks/useAuthRedirect";
import InventoryPage from '../components/InventoryPage';

export default function StorageRoomPage() {
  useAuthRedirect();
  return <InventoryPage title="Storage Room Inventory" location="storage" />;
}
