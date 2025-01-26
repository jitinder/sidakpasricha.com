import {
  addDailyChecklist,
  addLog,
  deleteLog,
  getAllDailyChecklist,
  getAllLogs,
  getLatestTargets,
  getUsers,
  removeDailyChecklist,
} from "@/lib/redis";
import AddTargetDialog from "./admin/AddTargetDialog";
import { Separator } from "@/components/ui/separator";
import { LogCard } from "./LogCard";
import LogChartCard from "./ChartCard";
import TargetProgress from "./TargetProgress";
import AddDailyChecklistDialog from "./AddDailyChecklistDialog";
import { ChecklistCard } from "./ChecklistCard";

export default async function WorkoutPage() {
  const users = await getUsers({});
  const targets = await getLatestTargets({});
  const logs = await getAllLogs({});
  const dailyChecklist = await getAllDailyChecklist({});

  return (
    <div className="flex flex-col w-full h-screen items-center gap-4">
      <h1 className="text-4xl font-bold text-center">Workout Tracker</h1>
      <AddTargetDialog
        users={users}
        onAdd={addLog}
        label="Log Progress"
        logType
      />
      <AddDailyChecklistDialog users={users} onAdd={addDailyChecklist} />
      <div className="md:w-1/2 sm:w-full flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Targets:</h1>
        <div className="flex flex-wrap w-full">
          {users.map((user) => (
            <div key={user} className="w-1/2 px-2 pb-4">
              <TargetProgress user={user} userLogs={logs} targets={targets} />
            </div>
          ))}
        </div>
        <Separator />
        <div className="flex flex-col gap-2 w-full">
          <h1 className="text-2xl font-bold pb-2">Overview:</h1>
          {users.map((user) => (
            <div key={user} className="h-[200px] w-full mb-6">
              <LogChartCard
                user={user}
                userLogs={logs}
                dailyChecklist={dailyChecklist}
              />
            </div>
          ))}
        </div>
        <Separator />
        <div className="mb-8">
          <h1 className="text-2xl font-bold pb-2">Logs:</h1>
          {logs.length ? (
            logs.map((userLog) => (
              <LogCard
                key={`${userLog.user}.${userLog.index}`}
                userLog={userLog}
                onDeleteLog={deleteLog}
              />
            ))
          ) : (
            <p>No progress logs found</p>
          )}
        </div>
        <div className="mb-8">
          <h1 className="text-2xl font-bold pb-2">Checklist:</h1>
          {dailyChecklist.length ? (
            dailyChecklist.map(({ user, ...checklist }) => (
              <ChecklistCard
                key={`${user}.${checklist.date}`}
                checklist={{ user, ...checklist }}
                onDeleteChecklist={removeDailyChecklist}
              />
            ))
          ) : (
            <p>No checklists filled</p>
          )}
        </div>
      </div>
    </div>
  );
}
