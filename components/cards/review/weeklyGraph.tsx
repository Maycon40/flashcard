import { Card } from "@/types/types";

export default function ReviewWeeklyGraph({
  cards,
}: {
  cards: Card[] | undefined;
}) {
  const chartHeight = 120;
  const barWidth = 30;

  function getUpcomingDays() {
    const days = [];
    const reviewPerDay = [];
    const today = new Date();

    for (let i = 0; i <= 6; i++) {
      const date = new Date(today);

      date.getUTCDate();
      date.setUTCDate(today.getUTCDate() + i);

      date.setUTCHours(0, 0, 0, 0);

      const weekName = new Intl.DateTimeFormat("pt-BR", {
        weekday: "short",
        timeZone: "UTC",
      })
        .format(date)
        .replace(".", "");

      const capitalizedWeek =
        weekName.charAt(0).toUpperCase() + weekName.slice(1);

      days.push({
        weekday: capitalizedWeek,
        day: date.toISOString(),
      });

      let cardsToReview: Card[] | undefined = [];

      if (i >= 1) {
        cardsToReview = cards?.filter(
          (card) => card.date_to_review == date.toISOString(),
        );
      } else {
        cardsToReview = cards?.filter(
          (card) =>
            card.date_to_review && card.date_to_review <= date.toISOString(),
        );
      }

      reviewPerDay.push(cardsToReview?.length || 0);
    }

    return { days, reviewPerDay };
  }

  const { days, reviewPerDay } = getUpcomingDays();

  const maxVal = Math.max(...reviewPerDay);

  return (
    <section>
      <div className="rounded-xl shadow-lg p-6 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
        <h2 className="text-lg font-bold mb-8 text-zinc-800 dark:text-zinc-100 tracking-tight">
          Flashcards para revisar por dia
        </h2>

        <div className="w-full flex justify-between items-end h-48 px-2">
          {reviewPerDay.map((val, i) => {
            const barHeight = (val / maxVal) * 100;

            return (
              <div key={i} className="flex flex-col items-center group">
                <span className="text-xs font-medium mb-2 text-indigo-700 transition-opacity">
                  {val}
                </span>

                <div
                  className="bg-indigo-600 hover:bg-indigo-800 rounded-t-md transition-all duration-300 hover:text-indigo-700 cursor-pointer shadow-sm"
                  style={{
                    width: `${barWidth}px`,
                    height: `${(barHeight / 100) * (chartHeight - 40)}px`,
                  }}
                />

                <p className="mt-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  {days[i].weekday}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
