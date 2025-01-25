"use server";

import { revalidatePath } from "next/cache";
import redis from "./redis";
import { Log, RedisEnv, Target } from "./types";

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
