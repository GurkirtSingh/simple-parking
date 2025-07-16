import { cn } from "@/lib/utils";
import Link from "next/link";

type SimpleParkingLogoProps = {
  className?: string;
  href?: string;
}

export function SimpleParkingLogo({
  className,
  href = "/",
}: SimpleParkingLogoProps) {
  return (
    <Link
      href={href}
      className={cn(
        "text-2xl font-bold tracking-tight hover:opacity-90",
        className
      )}
    >
      Simple Parking
    </Link>
  );
}