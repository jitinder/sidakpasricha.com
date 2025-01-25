"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import ExpandableInputButton from "@/components/ui/expandable-input-button";
import { Separator } from "@/components/ui/separator";
import { RedisEnv } from "@/lib/redis";

export default function UsersView({
  users,
  onAddUser,
}: {
  users: string[];
  onAddUser: ({ env, name }: { env?: RedisEnv; name: string }) => Promise<void>;
}) {
  return (
    <div className="flex flex-col items-start w-1/2 gap-2 my-8">
      <div className="flex w-full justify-between">
        <h2 className="text-xl">Users</h2>
        <ExpandableInputButton
          onSubmit={(value) => onAddUser({ name: value })}
        />
      </div>
      <Separator />
      {users.length ? (
        <div className="flex w-full">
          {users.map((user) => (
            <div key={user} className="w-1/3 p-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">{user}</CardTitle>
                </CardHeader>
              </Card>
            </div>
          ))}
        </div>
      ) : (
        <p>No users found</p>
      )}
    </div>
  );
}
