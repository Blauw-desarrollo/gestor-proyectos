import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import { getCurrentMember } from "@/lib/auth/roles";
import { NavLinks } from "./nav-links";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await getCurrentMember();

  return (
    <div className="flex min-h-full flex-1 bg-background">
      <aside className="flex w-56 flex-col gap-8 border-r border-border bg-surface px-4 py-6">
        <Image
          src="/brand/blauw-labs-logo.svg"
          alt="Blauw Labs"
          width={140}
          height={36}
        />
        <NavLinks />
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-end border-b border-border bg-surface px-6 py-3">
          <UserButton />
        </header>
        <main className="flex-1 px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
