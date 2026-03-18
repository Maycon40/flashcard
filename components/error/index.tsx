export default function ErrorComponent({ children }: any) {
  return (
    <div className="h-20 mt-10 flex justify-center items-center bg-red-400 text-white font-bold border-red-600 border-2 rounded-2xl">
      {children}
    </div>
  );
}
