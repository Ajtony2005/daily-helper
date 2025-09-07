export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-6xl font-bold text-panda-orange mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-panda-fur mb-2">
        Page Not Found
      </h2>
      <p className="text-panda-black mb-6">
        Sorry, the page you are looking for does not exist or has been moved.
      </p>
      <a
        href="/"
        className="px-4 py-2 rounded-xl bg-panda-fur text-panda-cream font-medium shadow-panda hover:bg-panda-orange hover:text-panda-fur transition-colors"
      >
        Go Home
      </a>
    </div>
  );
}
