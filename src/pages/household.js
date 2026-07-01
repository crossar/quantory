import useAuthRedirect from "../hooks/useAuthRedirect";
import InventoryPage from "../components/InventoryPage";

export default function HouseholdPage() {
  useAuthRedirect();
  return <InventoryPage title="Household Inventory" location="household" />;
}
