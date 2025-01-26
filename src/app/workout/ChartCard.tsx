"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { DailyChecklist, Target } from "@/lib/redis";
import { format, fromUnixTime } from "date-fns";
import React from "react";
import { Separator } from "@/components/ui/separator";

export default function LogChartCard({
  user,
  userLogs,
  dailyChecklist,
}: {
  user: string;
  userLogs: ({
    user: string;
  } & {
    index: number;
  } & Target)[];
  dailyChecklist: ({
    index: number;
    user: string;
  } & DailyChecklist)[];
}) {
  const chartData1 = React.useMemo(() => {
    return userLogs
      .map((userLog) =>
        userLog.user === user
          ? {
              date: userLog.deadline,
              weight: userLog.weight,
              bodyFat: userLog.bodyFat,
            }
          : undefined
      )
      .filter((log) => !!log);
  }, [user, userLogs]);

  const chartData2 = React.useMemo(() => {
    return dailyChecklist
      .map((checklist) =>
        checklist.user === user
          ? {
              date: checklist.date,
              workout: checklist.workout ? 1 : 0,
              progressPicture: checklist.progressPicture ? 1 : 0,
              diet: checklist.diet ? 1 : 0,
              logProgress: checklist.logProgress ? 1 : 0,
              steps: checklist.steps ? 1 : 0,
              sleep: checklist.sleep ? 1 : 0,
              water: checklist.water ? 1 : 0,
            }
          : undefined
      )
      .filter((log) => !!log);
  }, [dailyChecklist, user]);

  const chartConfig1 = {
    weight: {
      label: "Weight (kg)",
      color: "hsl(var(--chart-1))",
    },
    bodyFat: {
      label: "Body Fat (%)",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  const chartConfig2 = {
    workout: {
      label: "Workout",
    },
    progressPicture: {
      label: "Progress Picture",
    },
    diet: {
      label: "Diet",
    },
    logProgress: {
      label: "Log Progress",
    },
    steps: {
      label: "Step count",
    },
    sleep: {
      label: "Sleep",
    },
    water: {
      label: "Water",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{user}</CardTitle>
      </CardHeader>
      <CardContent className="pb-4 h-[150px] flex gap-2">
        {chartData1.length || chartData2.length ? (
          <>
            <ChartContainer
              config={chartConfig1}
              className="aspect-auto h-full w-full"
            >
              <AreaChart accessibilityLayer data={chartData1}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={2}
                  tickFormatter={(value: number) => {
                    return format(fromUnixTime(value), "dd-MM-yyyy");
                  }}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Area dataKey="weight" type="natural" fillOpacity={0.4} />
                <Area dataKey="bodyFat" type="natural" fillOpacity={0.4} />
              </AreaChart>
            </ChartContainer>
            <Separator orientation="vertical" />
            <ChartContainer
              config={chartConfig2}
              className="aspect-auto h-full w-full"
            >
              <BarChart accessibilityLayer data={chartData2}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={2}
                  tickFormatter={(value: number) => {
                    return format(fromUnixTime(value), "dd-MM-yyyy");
                  }}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      indicator="line"
                      labelFormatter={() => "Checklist"}
                    />
                  }
                />
                {Object.keys(chartConfig2).map((key, index) => (
                  <Bar
                    key={key}
                    dataKey={key}
                    stackId="a"
                    radius={[4, 4, 4, 4]}
                    fill={`hsl(var(--chart-${
                      index + 1 > 5 ? index + 1 - 5 : index + 1
                    }))`}
                  />
                ))}
              </BarChart>
            </ChartContainer>
          </>
        ) : (
          <p className="text-center text-muted-foreground">
            No progress logs or checklists found
          </p>
        )}
      </CardContent>
    </Card>
  );
}
