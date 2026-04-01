import useSWR from "swr";
import { GetServerSidePropsContext } from "next";

import Cards from "@/components/cards";
import LayoutDashboard from "@/components/layout/Dashboard";
import { fetcher } from "@/infra/fetcher";
import { Card } from "@/types/types";
import ErrorComponent from "@/components/error";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      deckName: context.params?.deck_name,
    },
  };
}

export default function DeckDetailsPage({ deckName }: { deckName: string }) {
  const {
    data: cards,
    error,
    isLoading,
  } = useSWR<Card[]>(`/api/v1/cards/${encodeURIComponent(deckName)}`, fetcher);

  if (error && error.status_code != 404) {
    return (
      <LayoutDashboard>
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{deckName}</h1>
        </div>

        <ErrorComponent>{error.message}</ErrorComponent>
      </LayoutDashboard>
    );
  }

  return (
    <LayoutDashboard>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{deckName}</h1>
        {isLoading ? (
          <div className="animate-pulse h-8 w-24 rounded-2xl bg-zinc-200 dark:bg-zinc-800"></div>
        ) : (
          <p className="text-zinc-500">
            {cards?.length || 0} cart{(cards || []).length > 1 ? "ões" : "ão"}{" "}
            neste baralho.
          </p>
        )}
      </div>

      {isLoading ? (
        <div className="h-24 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800"></div>
      ) : (
        <Cards cards={cards || []} />
      )}
    </LayoutDashboard>
  );
}
