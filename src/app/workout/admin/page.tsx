import {
  addTarget,
  addUser,
  getLatestTargets,
  getUsers,
  removeTarget,
} from "@/lib/redis";
import UsersView from "./Users";
import TargetsView from "./Targets";

export default async function WorkoutAdminPage() {
  const users = await getUsers({});
  const targets = await getLatestTargets({});

  return (
    <div className="flex flex-col w-full h-screen items-center gap-2">
      <h1 className="text-4xl font-bold text-center">Workout Admin</h1>
      <UsersView users={users} onAddUser={addUser} />
      <TargetsView
        users={users}
        targets={targets}
        onAddTarget={addTarget}
        onRemoveTarget={removeTarget}
      />
    </div>
  );
}
