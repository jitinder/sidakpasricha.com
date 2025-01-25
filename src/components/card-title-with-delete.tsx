"use client";

import { Trash } from "lucide-react";
import { Button } from "./ui/button";
import { CardTitle } from "./ui/card";

export default function CardTitleWithDelete({
  title,
  onDelete,
}: {
  title: string;
  onDelete: () => void;
}) {
  return (
    <CardTitle className="flex text-sm justify-between items-center">
      {title}
      <Button
        variant={"destructive"}
        className="h-8 w-8"
        onClick={() => onDelete()}
      >
        <Trash />
      </Button>
    </CardTitle>
  );
}
