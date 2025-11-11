import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900 dark:bg-black dark:text-zinc-100">
      <main className="ios-safe-top mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-16 px-6 py-16 pt-20 sm:gap-20 sm:px-10 sm:pt-24">
        <section className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <div className="flex items-center gap-3">
            <Image
              className="dark:invert"
              src="/next.svg"
              alt="Next.js logo"
              width={90}
              height={18}
              priority
            />
            <span className="rounded-full border border-zinc-200 px-2 py-0.5 text-xs text-zinc-700 dark:border-zinc-800 dark:text-zinc-300">
              App Router
            </span>
          </div>
          <h1 className="max-w-2xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Build faster with a clean starter UI
          </h1>
          <p className="max-w-2xl text-lg leading-7 text-zinc-600 dark:text-zinc-400">
            This template gives you a polished layout, ready-to-use components, and sensible
            defaults. Customize the content and ship.
          </p>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <a
              className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-black dark:hover:bg-zinc-200"
              href="https://nextjs.org/docs"
              target="_blank"
              rel="noopener noreferrer"
            >
              Read the Docs
            </a>
            <a
              className="inline-flex items-center justify-center rounded-lg border border-zinc-300 px-5 py-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-900"
              href="https://vercel.com/new"
              target="_blank"
              rel="noopener noreferrer"
            >
              Deploy to Vercel
            </a>
          </div>
        </section>

        <section className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950">
            <h3 className="mb-2 text-lg font-semibold">Type-safe by default</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              App directory, server components, and strict typing help you move quickly without breaking things.
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950">
            <h3 className="mb-2 text-lg font-semibold">Tailwind styling</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Utility-first styles with a clean, modern aesthetic. Dark mode friendly out of the box.
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950">
            <h3 className="mb-2 text-lg font-semibold">Production-ready</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Sensible defaults so you can focus on product, not boilerplate.
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950">
            <h3 className="mb-2 text-lg font-semibold">Easy to customize</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Swap content, tweak styles, and extend components to fit your needs.
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-dashed border-zinc-300 p-6 text-center dark:border-zinc-800">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Get started by editing <code className="rounded bg-zinc-100 px-1 py-0.5 dark:bg-zinc-900">app/page.tsx</code>
          </p>
        </section>
      </main>
    </div>
  );
}
