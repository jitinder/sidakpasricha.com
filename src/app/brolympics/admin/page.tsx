import ActivityManagement from "./ActivityManagement";
import UserManagement from "./UserManagement";

export default function AdminPage() {
  return (
    <div className="flex flex-col w-full h-screen items-center gap-4 p-8">
      <h1 className="text-4xl font-bold text-center">Brolympics Admin</h1>
      <div className="grid grid-cols-2 gap-8 w-full max-w-4xl">
        <UserManagement />
        <ActivityManagement />
      </div>
    </div>
  );
} 