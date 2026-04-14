export default function SuccessComponent({ children }: any) {
  return (
    <div className="rounded-md bg-green-50 border border-green-200 p-3 text-sm text-green-700">
      {children}
    </div>
  );
}
