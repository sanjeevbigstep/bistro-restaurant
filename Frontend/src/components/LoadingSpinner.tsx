export default function LoadingSpinner({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500" />
      {message && <p className="text-sm text-gray-500">{message}</p>}
    </div>
  );
}
