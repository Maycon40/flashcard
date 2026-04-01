export default function ConfirmLogout({
  children,
  logout,
  setLogout,
  callback,
}: any) {
  return (
    <>
      {logout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-xl max-w-sm w-full border border-zinc-200 dark:border-zinc-800">
            <h3 className="text-lg font-bold mb-2">Confirmar logout</h3>
            <p className="text-zinc-500 mb-6">{children}</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={callback}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md cursor-pointer"
              >
                Sair
              </button>
              <button
                onClick={() => setLogout(false)}
                className="px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
