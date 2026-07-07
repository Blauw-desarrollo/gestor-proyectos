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
    <div className="flex min-h-full flex-1 bg-background">
      <aside className="flex w-56 flex-col justify-between border-r border-border bg-surface px-4 py-6">
        <div className="flex flex-col gap-8">
          <Image
            src="/brand/blauw-labs-logo.svg"
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
      <main className="flex-1 px-6 py-8">{children}</main>
    </div>
  );
}
