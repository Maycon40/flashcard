"use client";

import Link from "next/link";

import LayoutDashboard from "@/components/layout/Dashboard";
import { Card } from "@/types/types";
import { withAuth } from "@/infra/auth";
import Cards from "@/components/cards";

export const getServerSideProps = withAuth(async (context) => {
  const { req } = context;

  const proto = (req.headers["x-forwarded-proto"] as string) || "http";
  const host = req.headers["host"];
  const origin = `${proto}://${host}`;

  const resCards = await fetch(`${origin}/api/v1/cards`, {
    headers: {
      cookie: req.headers.cookie || "",
    },
  });

  const cards = await resCards.json();

  return {
    props: {
      cards,
    },
  };
});

export default function CardsPage({ cards }: { cards: Card[] }) {
  return (
    <LayoutDashboard>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Cartões</h1>
          <p className="text-sm text-zinc-500">Gerencie todos os cartões</p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/cards/create"
            className="inline-flex items-center px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Criar
          </Link>
        </div>
      </div>

      <Cards cards={cards}></Cards>
    </LayoutDashboard>
  );
}
