import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { Hero } from "@/components/hero";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SimpleParkingLogo } from "@/components/SimpleParkingLogo";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center font-semibold">
              <SimpleParkingLogo className="text-lg" />
            </div>
            <div className="flex items-center gap-5">
              {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
              <ThemeSwitcher />
            </div>
          </div>
        </nav>
        <div>
          <Button>
            <Link href="/protected/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
        <div className="flex-1 flex flex-col max-w-5xl p-5">
          <SimpleParkingLogo className="text-6xl text-center"/>
          <Hero />
        </div>

        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-10">
          <p>
            Developed by{" "}
            <a
              href="https://github.com/GurkirtSingh"
              target="_blank"
              className="font-bold hover:underline"
              rel="noreferrer"
            >
              Gurkirt Singh
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
