"use server";

import { addLeaderboardEntry, getLeaderboard, removeLeaderboardEntry } from "@/lib/redis";
import { RedisEnv } from "@/lib/redis/types";

export async function getEntries(activity?: string) {
  return await getLeaderboard({ env: RedisEnv.DEV, activity });
}

export async function addEntry(entry: { name: string; score: number; activity: string }) {
  await addLeaderboardEntry({ entry, env: RedisEnv.DEV });
}

export async function removeEntry(name: string, activity?: string) {
  await removeLeaderboardEntry({ name, activity, env: RedisEnv.DEV });
} 