import { getEntries } from "./actions";
import LeaderboardView from "./LeaderboardView";

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
};

export default async function BrolympicsPage(props: Props) {
  const searchParams = await props.searchParams;
  const activity = typeof searchParams.activity === 'string' ? searchParams.activity : undefined;
  const entries = await getEntries(activity);

  return (
    <div className="flex flex-col w-full h-screen items-center gap-4">
      <h1 className="text-4xl font-bold text-center">Brolympics Leaderboard</h1>
      <LeaderboardView entries={entries} />
    </div>
  );
}
