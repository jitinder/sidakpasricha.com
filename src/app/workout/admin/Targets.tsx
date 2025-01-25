"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RedisEnv, Target } from "@/lib/redis";
import { format, fromUnixTime } from "date-fns";
import { CalendarCheck, PercentSquare, Weight } from "lucide-react";
import React from "react";
import AddTargetDialog from "./AddTargetDialog";
import CardTitleWithDelete from "@/components/card-title-with-delete";

const TargetTypes = [
  {
    icon: <Weight />,
    name: "Body Weight",
    fieldName: "weight" as keyof Target,
  },
  {
    icon: <PercentSquare />,
    name: "Body Fat",
    fieldName: "bodyFat" as keyof Target,
  },
  {
    icon: <CalendarCheck />,
    name: "Deadline",
    fieldName: "deadline" as keyof Target,
  },
];

export default function TargetsView({
  users,
  targets,
  onAddTarget,
  onRemoveTarget,
}: {
  users: string[];
  targets: Record<string, Target | null>;
  onAddTarget: ({
    env,
    user,
    target,
  }: {
    env?: RedisEnv;
    user: string;
    target: Target;
  }) => Promise<void>;
  onRemoveTarget: ({
    env,
    user,
  }: {
    env?: RedisEnv;
    user: string;
  }) => Promise<void>;
}) {
  const targetUsers = React.useMemo(() => Object.keys(targets), [targets]);

  const formattedTargetValue = React.useCallback(
    (user: string, fieldName: keyof Target) => {
      if (!targets[user]) {
        return "Unspecified";
      }
      if (fieldName === "deadline") {
        return format(fromUnixTime(targets[user][fieldName]), "dd/MM/yyyy");
      }
      return targets[user][fieldName];
    },
    [targets]
  );

  return (
    <div className="flex flex-col items-start w-1/2 gap-2 my-8">
      <div className="flex w-full justify-between">
        <h2 className="text-xl">Targets</h2>
        <AddTargetDialog users={users} onAdd={onAddTarget} />
      </div>
      <Separator />
      {targetUsers.length ? (
        <div className="flex w-full flex-wrap">
          {targetUsers.map((user) => (
            <div key={user} className="w-1/2 p-2">
              <Card>
                <CardHeader>
                  <CardTitleWithDelete
                    title={user}
                    onDelete={() => onRemoveTarget({ user })}
                  />
                </CardHeader>
                <CardContent>
                  <div>
                    {TargetTypes.map((targetType) => (
                      <div
                        key={targetType.name}
                        className="grid grid-cols-[0.25fr_1fr] pb-4 last:mb-0 last:pb-0 gap-2 items-center"
                      >
                        <div className="h-6 w-6 text-sky-500">
                          {targetType.icon}
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {targetType.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formattedTargetValue(user, targetType.fieldName)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      ) : (
        <p>No targets found</p>
      )}
    </div>
  );
}
