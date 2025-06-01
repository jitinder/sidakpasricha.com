"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2 } from "lucide-react";
import React from "react";
import { addUser, removeUser } from "./actions";

export default function UserManagement() {
  const [newUser, setNewUser] = React.useState("");
  const [users, setUsers] = React.useState<string[]>([]);

  React.useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch("/api/brolympics/users");
      const data = await response.json();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser) return;
    await addUser(newUser);
    setNewUser("");
    // Refresh users list
    const response = await fetch("/api/brolympics/users");
    const data = await response.json();
    setUsers(data);
  };

  const handleRemoveUser = async (user: string) => {
    await removeUser(user);
    // Refresh users list
    const response = await fetch("/api/brolympics/users");
    const data = await response.json();
    setUsers(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAddUser} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="user">New User</Label>
            <div className="flex gap-2">
              <Input
                id="user"
                value={newUser}
                onChange={(e) => setNewUser(e.target.value)}
                placeholder="Enter user name"
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
          <Label>Existing Users</Label>
          <div className="space-y-2">
            {users.map((user) => (
              <div key={user} className="flex items-center justify-between">
                <span>{user}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveUser(user)}
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