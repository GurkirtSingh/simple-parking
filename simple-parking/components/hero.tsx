
export function Hero() {
  return (
    <div className="flex flex-col gap-16 items-center">
      <div className="flex gap-8 justify-center items-center">
      </div>
      <h1 className="sr-only">Supabase and Next.js Starter Template</h1>
      <p className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center">
        Manage Your Parkings Effortlessly With{" "}
        Simple Parking
      </p>
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
      <p className="text-muted-foreground text-center max-w-2xl">
        A simple and powerful web app built with Next.js, TypeScript, and Supabase that lets you easily track and manage parking spaces, users, and roles — all in one place.
      </p>
    </div>
  );
}
