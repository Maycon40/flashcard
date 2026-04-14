import { ReactNode } from "react";

interface ButtonComponentProps {
  isLoading: boolean;
  children: ReactNode;
}

export default function ButtonComponent({
  isLoading,
  children,
}: ButtonComponentProps) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className="inline-flex items-center px-4 py-2 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed cursor-pointer"
    >
      {isLoading && (
        <div className="flex justify-center items-center mr-4">
          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
        </div>
      )}
      {children}
    </button>
  );
}
