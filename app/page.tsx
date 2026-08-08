import Navbar from "@/components/ui/navbar/navbar";

export default function Home() {
  return (
    <main>
      <Navbar />

      <section className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-black/50">
            Premium Security
          </p>

          <h1 className="text-5xl font-medium tracking-tight sm:text-7xl">
            Protection without compromise.
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-black/60 sm:text-lg">
            High-performance safes engineered to protect what matters most.
          </p>
        </div>
      </section>
    </main>
  );
}