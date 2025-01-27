"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Target } from "@/lib/redis";
import React from "react";
import { TargetTypes } from "./LogCard";
import { Badge } from "@/components/ui/badge";
import { format, formatDistanceToNow, fromUnixTime } from "date-fns";
import { Progress } from "@/components/ui/progress";

export default function TargetProgress({
  user,
  userLogs,
  targets,
}: {
  user: string;
  userLogs: ({
    user: string;
  } & {
    index: number;
  } & Target)[];
  targets: Record<string, Target>;
}) {
  const latestUserData = React.useMemo(
    () => userLogs.find(({ user: _user }) => _user === user),
    [user, userLogs]
  );

  const target = React.useMemo(() => targets[user], [user, targets]);

  const getProgress = React.useCallback(
    (fieldName: keyof Target) => {
      if (!latestUserData || !target) return 0;
      switch (fieldName) {
        case "weight":
          if (target.weight > latestUserData.weight) return 100;
          return (
            (1 -
              Math.abs(target.weight - latestUserData.weight) / target.weight) *
            100
          );
        case "bodyFat":
          if (target.bodyFat > latestUserData.bodyFat) return 100;
          return (
            (1 -
              Math.abs(target.bodyFat - latestUserData.bodyFat) /
                target.bodyFat) *
            100
          );
        case "deadline":
          return 100;
      }
    },
    [latestUserData, target]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{user}</CardTitle>
        <CardDescription className="text-sm flex flex-wrap">
          {target ? (
            Object.values(TargetTypes).map(({ fieldName, icon }) => (
              <div key={fieldName} className="px-2">
                <Badge
                  className="flex gap-2 justify-evenly"
                  variant={"secondary"}
                >
                  <div className="h-6 w-6 text-sky-500">{icon}</div>
                  {fieldName === "deadline"
                    ? format(fromUnixTime(target[fieldName]), "PP")
                    : fieldName === "bodyFat"
                    ? `${target[fieldName]} %`
                    : `${target[fieldName]} kg`}
                </Badge>
              </div>
            ))
          ) : (
            <p className="text-destructive w-full text-center">No target set</p>
          )}
        </CardDescription>
        <CardContent className="text-sm pb-1">
          {latestUserData && target ? (
            <div>
              {Object.values(TargetTypes).map(({ fieldName, icon }) => (
                <div
                  key={fieldName}
                  className="grid grid-cols-[0.25fr_1fr] items-center"
                >
                  {icon}
                  {fieldName === "deadline" ? (
                    <p className="text-center">
                      {formatDistanceToNow(fromUnixTime(target[fieldName]))}
                    </p>
                  ) : (
                    <Progress
                      className="my-2 [&>*]:bg-sky-500 bg-sky-200"
                      value={getProgress(fieldName)}
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-destructive w-full text-center">
              No data logged
            </p>
          )}
        </CardContent>
      </CardHeader>
    </Card>
  );
}
