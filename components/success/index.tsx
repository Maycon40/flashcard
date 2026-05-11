import { ReactNode } from "react";

export default function SuccessComponent({
  children,
}: {
  children: ReactNode;
}) {
  if (children) {
    return (
      <div className="rounded-md bg-green-50 border border-green-200 p-3 text-sm text-green-700">
        {children}
      </div>
    );
  }
}
