import {
  addLog,
  deleteLog,
  getAllLogs,
  // getLatestTargets,
  getUsers,
} from "@/lib/redis";
import AddTargetDialog from "./admin/AddTargetDialog";
import { Separator } from "@/components/ui/separator";
import { LogCard } from "./LogCard";
import ChartCard from "./ChartCard";

export default async function WorkoutPage() {
  const users = await getUsers({});
  // const targets = await getLatestTargets({});
  const logs = await getAllLogs({});
  const hasLogs = Object.keys(logs).length;

  return (
    <div className="flex flex-col w-full h-screen items-center gap-4">
      <h1 className="text-4xl font-bold text-center">Workout Tracker</h1>
      <AddTargetDialog users={users} onAdd={addLog} label="Log" logType />
      <div className="md:w-1/2 sm:w-full flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          {/* <h1 className="text-2xl font-bold pb-2">Overview:</h1>
          <div className="h-[300px] w-full bg-blue-500">Chart here</div>
          <Separator /> */}
          <h1 className="text-2xl font-bold pb-2">Progress:</h1>
          {users.map((user) => (
            <div key={user} className="h-[200px] w-full mb-6">
              <ChartCard user={user} userLogs={logs} />
            </div>
          ))}
        </div>
        <Separator />
        <div>
          <h1 className="text-2xl font-bold pb-2">Logs:</h1>
          {hasLogs ? (
            logs.map((userLog) => (
              <LogCard
                key={`${userLog.user}.${userLog.index}`}
                userLog={userLog}
                onDeleteLog={deleteLog}
              />
            ))
          ) : (
            <p>No logs found</p>
          )}
        </div>
      </div>
    </div>
  );
}
