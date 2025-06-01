"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import React from "react";
import { addEntry } from "./actions";

export default function AddScoreDialog() {
  const [score, setScore] = React.useState("");
  const [selectedUser, setSelectedUser] = React.useState("");
  const [selectedActivity, setSelectedActivity] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [users, setUsers] = React.useState<string[]>([]);
  const [activities, setActivities] = React.useState<string[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      const [usersResponse, activitiesResponse] = await Promise.all([
        fetch("/api/brolympics/users"),
        fetch("/api/brolympics/activities"),
      ]);
      const [usersData, activitiesData] = await Promise.all([
        usersResponse.json(),
        activitiesResponse.json(),
      ]);
      setUsers(usersData);
      setActivities(activitiesData);
    };
    fetchData();
  }, []);

  const handleAddScore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !score || !selectedActivity) return;
    await addEntry({
      name: selectedUser,
      score: parseInt(score),
      activity: selectedActivity,
    });
    setScore("");
    setSelectedUser("");
    setSelectedActivity("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Score
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Score</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleAddScore} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="user">User</Label>
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger>
                <SelectValue placeholder="Select a user" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user} value={user}>
                    {user}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="activity">Activity</Label>
            <Select value={selectedActivity} onValueChange={setSelectedActivity}>
              <SelectTrigger>
                <SelectValue placeholder="Select an activity" />
              </SelectTrigger>
              <SelectContent>
                {activities.map((activity) => (
                  <SelectItem key={activity} value={activity}>
                    {activity}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="score">Score</Label>
            <Input
              id="score"
              type="number"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              placeholder="Enter score"
            />
          </div>
          <Button type="submit" className="w-full">
            Add Score
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
} 