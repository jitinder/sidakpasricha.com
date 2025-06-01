"use server";

import { RedisEnv } from "@/lib/redis/types";
import redis from "@/lib/redis/redis";

function getKey(env: RedisEnv, ...keys: string[]) {
  return `${env}:${keys.join(":")}`;
}

export async function addActivity(activity: string) {
  await redis.sAdd(getKey(RedisEnv.DEV, "brolympics", "activities"), activity);
}

export async function removeActivity(activity: string) {
  await redis.sRem(getKey(RedisEnv.DEV, "brolympics", "activities"), activity);
  // Also remove the activity's leaderboard
  await redis.del(getKey(RedisEnv.DEV, "brolympics", "leaderboard", activity));
}

export async function addUser(name: string) {
  await redis.lPush(getKey(RedisEnv.DEV, "brolympics", "users"), name);
}

export async function removeUser(name: string) {
  // Remove from leaderboard if exists
  const activities = await redis.sMembers(getKey(RedisEnv.DEV, "brolympics", "activities"));
  await Promise.all(
    activities.map((activity) =>
      redis.zRem(getKey(RedisEnv.DEV, "brolympics", "leaderboard", activity), name)
    )
  );
  // Remove from users list
  const users = await redis.lRange(getKey(RedisEnv.DEV, "brolympics", "users"), 0, -1);
  const index = users.indexOf(name);
  if (index !== -1) {
    await redis.lSet(getKey(RedisEnv.DEV, "brolympics", "users"), index, "DELETED");
    await redis.lRem(getKey(RedisEnv.DEV, "brolympics", "users"), 0, "DELETED");
  }
} 