"use server";

import { revalidatePath } from "next/cache";
import redis from "./redis";
import { DailyChecklist, Log, RedisEnv, Target, LeaderboardEntry } from "./types";

function getKey(env: RedisEnv, ...keys: string[]) {
  return `${env}:${keys.join(":")}`;
}

export async function addUser({
  env = RedisEnv.DEV,
  name,
}: {
  env?: RedisEnv;
  name: string;
}) {
  await redis.lPush(getKey(env, "users"), name);
  revalidatePath("/workout");
}

export async function getUsers({ env = RedisEnv.DEV }: { env?: RedisEnv }) {
  return await redis.lRange(getKey(env, "users"), 0, -1);
}

export async function addTarget({
  env = RedisEnv.DEV,
  user,
  target,
}: {
  env?: RedisEnv;
  user: string;
  target: Target;
}) {
  await redis.json.set(getKey(env, "targets", user), "$", target);
  revalidatePath("/workout");
}

export async function removeTarget({
  env = RedisEnv.DEV,
  user,
}: {
  env?: RedisEnv;
  user: string;
}) {
  await redis.del(getKey(env, "targets", user));
  revalidatePath("/workout");
}

export async function getLatestTargets({
  env = RedisEnv.DEV,
}: {
  env?: RedisEnv;
}): Promise<Record<string, Target>> {
  const users = await getUsers({ env });
  const targets: Record<string, Target> = {};
  await Promise.all(
    users.map(async (user) => {
      const target = await getTargets({ user });
      if (target) {
        targets[user] = target;
      }
    })
  );
  return targets;
}

export async function getTargets({
  env = RedisEnv.DEV,
  user,
}: {
  env?: RedisEnv;
  user: string;
}): Promise<Target | null> {
  const val = await redis.json.get(getKey(env, "targets", user));
  return val ? (val as Target) : null;
}

export async function addLog({
  env = RedisEnv.DEV,
  user,
  log,
}: {
  env?: RedisEnv;
  user: string;
  log: Log;
}) {
  await redis.lPush(getKey(env, "logs", user), JSON.stringify(log));
  revalidatePath("/workout");
}

export async function deleteLog({
  env = RedisEnv.DEV,
  user,
  index,
}: {
  env?: RedisEnv;
  user: string;
  index: number;
}) {
  await redis.lSet(getKey(env, "logs", user), index, "DELETED");
  await redis.lRem(getKey(env, "logs", user), 0, "DELETED");
  revalidatePath("/workout");
}

export async function getAllLogs({ env = RedisEnv.DEV }: { env?: RedisEnv }) {
  const users = await getUsers({ env });
  const logs = await Promise.all(
    users.map(async (user) => getLogs({ env, user }))
  );
  const logsWithUser = logs
    .map((userLogs, index) =>
      userLogs.map((log) => Object.assign({ user: users[index] }, log))
    )
    .flat();
  const sortedLogs = logsWithUser.toSorted((a, b) => a.deadline - b.deadline);
  return sortedLogs;
}

export async function getLogs({
  env = RedisEnv.DEV,
  user,
}: {
  env?: RedisEnv;
  user: string;
}): Promise<({ index: number } & Log)[]> {
  const logs = await redis.lRange(getKey(env, "logs", user), 0, -1);
  return logs.map((log, index) => {
    return {
      index,
      ...JSON.parse(log),
    };
  });
}

export async function addDailyChecklist({
  env = RedisEnv.DEV,
  user,
  checklist,
}: {
  env?: RedisEnv;
  user: string;
  checklist: DailyChecklist;
}) {
  await redis.lPush(
    getKey(env, "dailyChecklist", user),
    JSON.stringify(checklist)
  );
  revalidatePath("/workout");
}

export async function getDailyChecklist({
  env = RedisEnv.DEV,
  user,
}: {
  env?: RedisEnv;
  user: string;
}): Promise<({ index: number } & DailyChecklist)[]> {
  const checklists = await redis.lRange(
    getKey(env, "dailyChecklist", user),
    0,
    -1
  );
  return checklists.map((checklist, index) => {
    return { index, ...JSON.parse(checklist) };
  });
}

export async function removeDailyChecklist({
  env = RedisEnv.DEV,
  user,
  index,
}: {
  env?: RedisEnv;
  user: string;
  index: number;
}) {
  await redis.lSet(getKey(env, "dailyChecklist", user), index, "DELETED");
  await redis.lRem(getKey(env, "dailyChecklist", user), 0, "DELETED");
  revalidatePath("/workout");
}

export async function getAllDailyChecklist({
  env = RedisEnv.DEV,
}: {
  env?: RedisEnv;
}) {
  const users = await getUsers({ env });
  const checklistsWithUser = await Promise.all(
    users.map(async (user) => {
      const checklists = await getDailyChecklist({ env, user });
      return checklists.map((checklist) => ({ user, ...checklist }));
    })
  );
  const sortedChecklists = checklistsWithUser
    .flat()
    .toSorted((a, b) => a.date - b.date);
  return sortedChecklists;
}

export async function getBrolympicsUsers({ env = RedisEnv.DEV }: { env?: RedisEnv }) {
  const users = await redis.lRange(getKey(env, "brolympics", "users"), 0, -1);
  return users.filter((user) => user !== "DELETED");
}

export async function addBrolympicsUser(name: string) {
  await redis.lPush(getKey(RedisEnv.DEV, "brolympics", "users"), name);
  revalidatePath("/brolympics");
}

export async function removeBrolympicsUser(name: string) {
  "use server";
  // Remove from leaderboard if exists
  await removeLeaderboardEntry({ name, env: RedisEnv.DEV });
  // Remove from users list
  const users = await getBrolympicsUsers({ env: RedisEnv.DEV });
  const index = users.indexOf(name);
  if (index !== -1) {
    await redis.lSet(getKey(RedisEnv.DEV, "brolympics", "users"), index, "DELETED");
    await redis.lRem(getKey(RedisEnv.DEV, "brolympics", "users"), 0, "DELETED");
  }
  revalidatePath("/brolympics");
} 

export async function addLeaderboardEntry({
  env = RedisEnv.DEV,
  entry,
}: {
  env?: RedisEnv;
  entry: LeaderboardEntry;
}) {
  await redis.zAdd(getKey(env, "brolympics", "leaderboard", entry.activity), {
    score: entry.score,
    value: entry.name,
  });
  revalidatePath("/brolympics");
}

export async function removeLeaderboardEntry({
  env = RedisEnv.DEV,
  name,
  activity,
}: {
  env?: RedisEnv;
  name: string;
  activity?: string;
}) {
  if (activity) {
    await redis.zRem(getKey(env, "brolympics", "leaderboard", activity), name);
  } else {
    // If no activity specified, remove from all activities
    const activities = await getActivities({ env });
    await Promise.all(
      activities.map((activity) =>
        redis.zRem(getKey(env, "brolympics", "leaderboard", activity), name)
      )
    );
  }
  revalidatePath("/brolympics");
}

export async function getLeaderboard({
  env = RedisEnv.DEV,
  activity,
}: {
  env?: RedisEnv;
  activity?: string;
}): Promise<LeaderboardEntry[]> {
  if (activity) {
    const entries = await redis.zRangeWithScores(
      getKey(env, "brolympics", "leaderboard", activity),
      0,
      -1,
      {
        REV: true,
      }
    );
    return entries.map((entry) => ({
      name: entry.value,
      score: entry.score,
      activity,
    }));
  } else {
    // Get all activities and combine scores
    const activities = await getActivities({ env });
    const allEntries = await Promise.all(
      activities.map(async (activity) => {
        const entries = await redis.zRangeWithScores(
          getKey(env, "brolympics", "leaderboard", activity),
          0,
          -1
        );
        return entries.map((entry) => ({
          name: entry.value,
          score: entry.score,
          activity,
        }));
      })
    );

    // Combine scores for each user across activities
    const combinedScores = allEntries
      .flat()
      .reduce((acc, entry) => {
        if (!acc[entry.name]) {
          acc[entry.name] = { name: entry.name, score: 0, activity: "combined" };
        }
        acc[entry.name].score += entry.score;
        return acc;
      }, {} as Record<string, LeaderboardEntry>);

    return Object.values(combinedScores).sort((a, b) => b.score - a.score);
  }
}

export async function getActivities({ env = RedisEnv.DEV }: { env?: RedisEnv }) {
  return await redis.sMembers(getKey(env, "brolympics", "activities"));
}
