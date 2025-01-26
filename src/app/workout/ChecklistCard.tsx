"use client";

import CardTitleWithDelete from "@/components/card-title-with-delete";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import { DailyChecklist, removeDailyChecklist } from "@/lib/redis";
import { format, fromUnixTime } from "date-fns";
import { Calendar } from "lucide-react";

const TargetTypes = {
  workout: {
    fieldName: "workout" as keyof DailyChecklist,
    label: "Workout",
  },
  progressPicture: {
    fieldName: "progressPicture" as keyof DailyChecklist,
    label: "Progress Picture",
  },
  diet: {
    fieldName: "diet" as keyof DailyChecklist,
    label: "Diet",
  },
  logProgress: {
    fieldName: "logProgress" as keyof DailyChecklist,
    label: "Log Progress",
  },
  steps: {
    fieldName: "steps" as keyof DailyChecklist,
    label: "Steps",
  },
};

export function ChecklistCard({
  checklist,
  onDeleteChecklist,
}: {
  checklist: {
    user: string;
  } & {
    index: number;
  } & DailyChecklist;
  onDeleteChecklist: typeof removeDailyChecklist;
}) {
  return (
    <Card key={`${checklist.user}.${checklist.index}`} className="my-2">
      <CardHeader>
        <CardTitleWithDelete
          title={checklist.user}
          onDelete={async () =>
            await onDeleteChecklist({
              user: checklist.user,
              index: checklist.index,
            })
          }
        />
        <CardDescription>
          <p className="flex gap-2 items-center pb-4">
            <Calendar /> {format(fromUnixTime(checklist["date"]), "PPP")}
          </p>
          <div className="w-full flex flex-wrap">
            {Object.values(TargetTypes).map(({ fieldName, label }) => (
              <div key={fieldName} className="px-2 md:w-1/4 sm:w-1/3">
                <Badge
                  className="h-[30px] gap-2 w-full mb-2"
                  variant={"secondary"}
                >
                  <p>{checklist[fieldName] ? "✅" : "❌"}</p>
                  <p>{label}</p>
                </Badge>
              </div>
            ))}
          </div>
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
