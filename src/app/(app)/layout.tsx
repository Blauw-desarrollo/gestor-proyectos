import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import { getCurrentMember } from "@/lib/auth/roles";
import { NavLinks } from "./nav-links";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const member = await getCurrentMember();

  return (
    <div className="flex min-h-full flex-1 gap-4 p-4">
      <aside className="flex w-56 flex-col justify-between rounded-2xl border border-border bg-surface/70 px-4 py-6 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col gap-8">
          <Image
            src="/brand/blauw-labs-logo-light.svg"
            alt="Blauw Labs"
            width={140}
            height={36}
          />
          <NavLinks />
        </div>
        <div className="flex items-center gap-2 border-t border-border pt-4">
          <UserButton />
          <span className="truncate text-sm text-foreground/70">
            {member.display_name ?? "Mi cuenta"}
          </span>
        </div>
      </aside>
      <main className="flex-1 px-2 py-2">{children}</main>
    </div>
  );
}
