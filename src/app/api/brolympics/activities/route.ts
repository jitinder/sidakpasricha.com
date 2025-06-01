import { getActivities } from "@/lib/redis/utils";
import { RedisEnv } from "@/lib/redis/types";
import { NextResponse } from "next/server";

export async function GET() {
  const activities = await getActivities({ env: RedisEnv.DEV });
  return NextResponse.json(activities);
} 