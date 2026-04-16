import { ReactNode } from "react";

interface TagComponentProps {
  className?: string;
  active?: boolean;
  children: ReactNode;
}

export default function TagComponent({
  className,
  active,
  children,
}: TagComponentProps) {
  return (
    <>
      {active && (
        <span
          className={`${className} text-xs font-bold px-2 py-1 rounded-full`}
        >
          {children}
        </span>
      )}
    </>
  );
}
