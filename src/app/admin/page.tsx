import  Users  from "@/components/users"
// import AddOperatorForm from "@/components/shared/AddOperatorForm"
import AddUserForm from "@/components/shared/AddUserForm";
import OperatorsTable from "@/components/operators";
import AddCable from "@/components/AddCable";
import CablePointForm from "@/components/CablePointForm";
import ProviderTable from "@/components/Providers";


interface AdminPanelProps {
  activeTab: string;
}

export default function AdminPanel({ activeTab }: AdminPanelProps) {
  return (
    <div className="p-6">
      {activeTab === "users" && <Users />}
      {activeTab === "operators" && <OperatorsTable />}
      {activeTab === "adduser" && <AddUserForm onUserAdded={function (): void {
        throw new Error("Function not implemented.");
      } } />}
      {activeTab === "addCable" && <ProviderTable />}
    </div>
  )
}