import { Card } from "@/types/types";

export default async function exportCards(cards: Card[]) {
  let txtContent = "#separator:tab\n#html:true\n#deck column:1\n";

  for (const card of cards) {
    const deck = card.deck_name || "Padrao";
    const name = card.name || "";
    const description = card.description || "";

    txtContent += `${deck}\t${name}\t${description}\n`;
  }

  const blob = new Blob([txtContent], { type: "text/plain;charset=utf-8" });

  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;

  const date = new Date().toISOString().replace(/[:.-]/g, "");
  link.download = `MyFlashcard-Export-${date}.txt`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
