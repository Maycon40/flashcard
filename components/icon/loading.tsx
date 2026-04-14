interface LoadingIconProps {
  isLoading: boolean;
}

export default function LoadingIcon({ isLoading }: LoadingIconProps) {
  return (
    <>
      {isLoading && (
        <div className="flex justify-center items-center mx-5">
          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
        </div>
      )}
    </>
  );
}
