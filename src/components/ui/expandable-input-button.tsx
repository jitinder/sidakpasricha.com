"use client";

import { useState, useRef, useEffect } from "react";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ExpandableInputButton({
  onSubmit,
}: {
  onSubmit: (value: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [value, setValue] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSubmit(value);
      setValue("");
      setIsExpanded(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => !value && setIsExpanded(false)}
    >
      <Button
        size="icon"
        variant="outline"
        aria-label="Add new item"
        className={`transition-opacity duration-300 ${
          isExpanded ? "opacity-0" : "opacity-100"
        } absolute right-0 bottom-0`}
      >
        <PlusIcon className="h-4 w-4" />
      </Button>
      <div
        className={`absolute right-0 bottom-0 w-2/3 transition-all duration-300 ${
          isExpanded
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <form
          onSubmit={handleSubmit}
          className="flex w-full items-center space-x-2"
        >
          <Input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="flex-grow"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!value.trim()}
            aria-label="Add new item"
            variant={"outline"}
          >
            <PlusIcon className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
