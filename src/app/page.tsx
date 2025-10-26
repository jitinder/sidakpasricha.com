import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  const pages: { name: string; path: string; description: string }[] = [];

  return (
    <div className="flex flex-col w-full h-screen items-center justify-center gap-4">
      <h1 className="text-4xl font-bold text-center">Hello, World!</h1>
      <p>This is my personal website. It&apos;s currently under construction</p>
      <div className="flex flex-col py-8 gap-4">
        <p>Pages you can visit:</p>
        {pages.map((page) => (
          <Link key={page.name} href={"/workout"}>
            <Card>
              <CardHeader>
                <CardTitle>{page.name}</CardTitle>
                <CardDescription>{page.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
