import { getBrolympicsUsers } from "@/lib/redis";
import { NextResponse } from "next/server";

export async function GET() {
  const users = await getBrolympicsUsers({});
  return NextResponse.json(users);
} 