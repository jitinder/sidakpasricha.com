"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { addLog, addTarget, Target } from "@/lib/redis";
import { CalendarIcon, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { format, getUnixTime } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import React from "react";

export default function AddTargetDialog({
  users,
  onAdd,
  label,
  logType,
}: {
  users: string[];
  onAdd: typeof addTarget | typeof addLog;
  logType?: boolean;
  label?: string;
}) {
  const [open, setOpen] = React.useState(false);

  const FormSchema = z.object({
    user: z.string({
      required_error: "A user is required.",
    }),
    weight: z.coerce.number({
      required_error: "A weight is required.",
    }),
    bodyFat: z.coerce
      .number({
        required_error: "A body fat percentage is required.",
      })
      .gt(5, "Body fat percentage must be greater than 5."),
    deadline: z.coerce.date({
      required_error: "A date is required.",
    }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const target: Target = {
      weight: data.weight,
      bodyFat: data.bodyFat,
      deadline: getUnixTime(data.deadline),
    };
    await onAdd({
      user: data.user,
      target,
      log: target,
    });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size={label ? "default" : "icon"} variant={"outline"}>
          {label ? label : null}
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add {logType ? "Log" : "Target"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="user"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel>Name</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select a user" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user} value={user}>
                          {user}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="weight"
              defaultValue={75}
              render={({ field }) => (
                <FormItem>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <FormLabel>Weight</FormLabel>
                    <FormControl>
                      <div className="col-span-3 flex items-center gap-2">
                        <Input {...field} />
                        <Label className="text-muted-foreground">kg</Label>
                      </div>
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bodyFat"
              defaultValue={12}
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel>Body Fat</FormLabel>
                  <FormControl>
                    <div className="col-span-3 flex items-center gap-2">
                      <Input {...field} />
                      <Label className="text-muted-foreground">%</Label>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel>{logType ? "Date" : "Deadline"}</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[200px] text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
