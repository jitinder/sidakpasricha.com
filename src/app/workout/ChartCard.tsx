"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Target } from "@/lib/redis";
import { format, fromUnixTime } from "date-fns";
import React from "react";

export default function ChartCard({
  user,
  userLogs,
}: {
  user: string;
  userLogs: ({
    user: string;
  } & {
    index: number;
  } & Target)[];
}) {
  const chartData = React.useMemo(() => {
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

  const chartConfig = {
    weight: {
      label: "Weight (kg)",
      color: "hsl(var(--chart-1))",
    },
    bodyFat: {
      label: "Body Fat (%)",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{user}</CardTitle>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <AreaChart accessibilityLayer data={chartData}>
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
      </CardContent>
    </Card>
  );
}
