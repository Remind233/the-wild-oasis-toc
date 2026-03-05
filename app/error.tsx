"use client";

//只有渲染错误才会被捕获，根layout中的错误不会被捕获
interface ErrorProps {
  error: Error & { digest?: string }; // Next.js 可能会添加 digest 属性
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <main className="flex justify-center items-center flex-col gap-6">
      <h1 className="text-3xl font-semibold">Something went wrong!</h1>
      <p className="text-lg">{error.message}</p>

      <button
        onClick={reset}
        className="inline-block bg-accent-500 text-primary-800 px-6 py-3 text-lg"
      >
        Try again
      </button>
    </main>
  );
}
