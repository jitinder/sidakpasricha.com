"use client";

import { Card, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LeaderboardEntry } from "@/lib/redis/types";
import React from "react";
import CardTitleWithDelete from "@/components/card-title-with-delete";
import { removeEntry } from "./actions";
import AddScoreDialog from "./AddScoreDialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";

export default function LeaderboardView({
  entries,
}: {
  entries: LeaderboardEntry[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activities, setActivities] = React.useState<string[]>([]);
  const selectedActivity = searchParams.get("activity") || "All Activities";

  React.useEffect(() => {
    const fetchActivities = async () => {
      const response = await fetch("/api/brolympics/activities");
      const data = await response.json();
      setActivities(data);
    };
    fetchActivities();
  }, []);

  const handleActivityChange = (activity: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (activity === "All Activities") {
      params.delete("activity");
    } else {
      params.set("activity", activity);
    }
    router.push(`/brolympics?${params.toString()}`);
  };

  return (
    <div className="flex flex-col items-start w-1/2 gap-2 my-8">
      <div className="flex w-full justify-between items-center">
        <div className="flex items-center gap-4">
          <h2 className="text-xl">Leaderboard</h2>
          <Select value={selectedActivity} onValueChange={handleActivityChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select activity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Activities">All Activities</SelectItem>
              {activities.map((activity) => (
                <SelectItem key={activity} value={activity}>
                  {activity}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <AddScoreDialog />
      </div>
      <Separator />
      {entries.length ? (
        <div className="flex w-full flex-col gap-2">
          {entries.map((entry, index) => (
            <Card key={`${entry.name}-${entry.activity}`}>
              <CardHeader>
                <CardTitleWithDelete
                  title={`${index === 0 ? "🏆 " : ""}${entry.name} - ${entry.score} points${
                    selectedActivity === "All Activities" ? ` (${entry.activity})` : ""
                  }`}
                  onDelete={() => removeEntry(entry.name, entry.activity)}
                />
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : (
        <p>No entries found</p>
      )}
    </div>
  );
} 