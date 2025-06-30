import { SignUpForm } from "@/components/sign-up-form";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
      <h1 className="flex w-full item-center justify-center p-6 text-3xl font-bold">
        Simple Parking
      </h1>
        <SignUpForm />
      </div>
    </div>
  );
}
