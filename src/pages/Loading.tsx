export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in">
      <div className="w-16 h-16 border-4 border-panda-fur border-t-panda-orange rounded-full animate-spin mb-6"></div>
      <h2 className="text-xl font-semibold text-panda-fur">Loading...</h2>
      <p className="text-panda-black mt-2">
        Please wait while we fetch your data.
      </p>
    </div>
  );
}
