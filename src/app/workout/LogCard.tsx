"use client";

import CardTitleWithDelete from "@/components/card-title-with-delete";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import { deleteLog, Target } from "@/lib/redis";
import { fromUnixTime, format } from "date-fns";
import { CalendarCheck, PercentSquare, Weight } from "lucide-react";

export const TargetTypes = [
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

export function LogCard({
  userLog,
  onDeleteLog,
}: {
  userLog: {
    user: string;
  } & {
    index: number;
  } & Target;
  onDeleteLog: typeof deleteLog;
}) {
  return (
    <Card key={`${userLog.user}.${userLog.index}`} className="my-2">
      <CardHeader>
        <CardTitleWithDelete
          title={userLog.user}
          onDelete={async () =>
            await onDeleteLog({ user: userLog.user, index: userLog.index })
          }
        />
        <CardDescription>
          <div className="flex w-full flex-wrap">
            {Object.values(TargetTypes).map(({ fieldName, icon }) => (
              <div key={fieldName} className="p-2 md:w-1/4 w-full">
                <Badge
                  className="flex gap-2 justify-start"
                  variant={"secondary"}
                >
                  <div className="h-6 w-6 text-sky-500 flex-1">{icon}</div>
                  {fieldName === "deadline"
                    ? format(fromUnixTime(userLog[fieldName]), "PP")
                    : fieldName === "bodyFat"
                    ? `${userLog[fieldName]} %`
                    : `${userLog[fieldName]} kg`}
                </Badge>
              </div>
            ))}
          </div>
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
