import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";
import { DashboardButton } from "@/components/dashboard-button";
import ManagePropertiesButton from "@/components/manage-properties-button";
import { SimpleParkingLogo } from "@/components/SimpleParkingLogo";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-10 items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-6xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center font-semibold">
              <SimpleParkingLogo className="text-lg" />
            </div>
            <div className="flex items-center gap-5">
              {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
              <ThemeSwitcher />
            </div>
          </div>
        </nav>
        <div className="flex-1 flex flex-col w-full lg:max-w-6xl px-2 gap-10">
          <div className="flex justify-start gap-2">
            <ManagePropertiesButton />
            <DashboardButton />
          </div>
          {children}
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
