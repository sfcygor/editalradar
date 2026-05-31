import { getRanking } from "@/lib/actions/friends";
import { requireAuth } from "@/lib/session";
import RankingClient from "./RankingClient";

export default async function RankingPage() {
  const session = await requireAuth();
  const ranking = await getRanking();

  return <RankingClient ranking={ranking} currentUserId={session.userId} />;
}
