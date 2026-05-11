import { ReactNode } from "react";

export default function ErrorComponent({ children }: { children: ReactNode }) {
  if (children) {
    return (
      <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
        {children}
      </div>
    );
  }
}
