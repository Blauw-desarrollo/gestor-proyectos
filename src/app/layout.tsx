import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { esES } from "@clerk/localizations";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gestor de Proyectos — Blauw Labs",
  description: "Imputación de horas estimadas y reales a tareas.",
};

// @clerk/localizations deja signIn.start.titleCombined/subtitleCombined sin
// traducir (caen a inglés) para la pantalla combinada que se usa cuando el
// registro público está desactivado. Se completan aquí a mano.
const localization = {
  ...esES,
  signIn: {
    ...esES.signIn,
    start: {
      ...esES.signIn?.start,
      titleCombined: "Iniciar sesión",
      subtitleCombined: "para continuar en Blauw Labs",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      localization={localization}
      appearance={{
        variables: {
          colorPrimary: "#003ce5",
          colorForeground: "#ede6d8",
          colorBackground: "#2b2419",
          colorInput: "#352c1e",
          colorInputForeground: "#ede6d8",
          colorNeutral: "#ffffff",
          colorMutedForeground: "#a89d87",
          fontFamily: "var(--font-nunito)",
          borderRadius: "0.5rem",
        },
        elements: {
          formButtonPrimary: { borderRadius: "0.5rem" },
        },
      }}
    >
      <html
        lang="es"
        className={`${nunito.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col font-sans">{children}</body>
      </html>
    </ClerkProvider>
  );
}
