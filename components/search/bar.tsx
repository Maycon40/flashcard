interface SearchBarProps {
  value: string;
  onChange: any;
  className?: string;
}

export default function SearchBar({
  value,
  onChange,
  className,
}: SearchBarProps) {
  return (
    <div className={`relative w-full sm:w-64 ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg
          className="h-5 w-5 text-zinc-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <input
        type="text"
        placeholder="Pesquisar..."
        className="block w-full pl-10 pr-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md leading-5 bg-white dark:bg-zinc-900 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
