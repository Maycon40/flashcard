"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function CopyButton({
  children: textToCopy,
}: {
  children: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Erro ao copiar:", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center justify-center p-2 rounded-lg transition-all duration-200 active:scale-95 bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
      title={copied ? "Copiado!" : "Copiar"}
    >
      <div className="relative w-5 h-5">
        <div
          className={`absolute inset-0 transition-all duration-300 transform ${
            copied ? "scale-100 opacity-100" : "scale-0 opacity-0"
          }`}
        >
          <Check className="w-5 h-5 text-green-500" />
        </div>

        <div
          className={`absolute inset-0 transition-all duration-300 transform ${
            copied ? "scale-0 opacity-0" : "scale-100 opacity-100"
          }`}
        >
          <Copy className="w-5 h-5" />
        </div>
      </div>
    </button>
  );
}
