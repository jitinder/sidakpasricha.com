"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2 } from "lucide-react";
import React from "react";
import { addActivity, removeActivity } from "./actions";

export default function ActivityManagement() {
  const [newActivity, setNewActivity] = React.useState("");
  const [activities, setActivities] = React.useState<string[]>([]);

  React.useEffect(() => {
    const fetchActivities = async () => {
      const response = await fetch("/api/brolympics/activities");
      const data = await response.json();
      setActivities(data);
    };
    fetchActivities();
  }, []);

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivity) return;
    await addActivity(newActivity);
    setNewActivity("");
    // Refresh activities list
    const response = await fetch("/api/brolympics/activities");
    const data = await response.json();
    setActivities(data);
  };

  const handleRemoveActivity = async (activity: string) => {
    await removeActivity(activity);
    // Refresh activities list
    const response = await fetch("/api/brolympics/activities");
    const data = await response.json();
    setActivities(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Management</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAddActivity} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="activity">New Activity</Label>
            <div className="flex gap-2">
              <Input
                id="activity"
                value={newActivity}
                onChange={(e) => setNewActivity(e.target.value)}
                placeholder="Enter activity name"
              />
              <Button type="submit">
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </div>
        </form>
        <Separator className="my-4" />
        <div className="space-y-2">
          <Label>Existing Activities</Label>
          <div className="space-y-2">
            {activities.map((activity) => (
              <div key={activity} className="flex items-center justify-between">
                <span>{activity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveActivity(activity)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 