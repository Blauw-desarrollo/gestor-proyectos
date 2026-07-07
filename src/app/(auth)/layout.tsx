import Image from "next/image";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 bg-background px-6 py-16">
      <Image
        src="/brand/blauw-labs-logo.svg"
        alt="Blauw Labs"
        width={180}
        height={47}
        priority
      />
      {children}
    </div>
  );
}
