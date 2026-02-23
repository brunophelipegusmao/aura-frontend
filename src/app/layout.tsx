import type { Metadata } from "next";
import { Nunito, Roboto } from "next/font/google";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import "./globals.css";
import { Container } from "@/components/Container";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SwupProvider } from "@/components/SwupProvider";
import { IntroLoader } from "@/components/IntroLoader";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Aura Activewear",
  description: "Moda fitness com tecnologia e performance para o seu treino.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${nunito.variable} ${roboto.variable} antialiased bg-accent`}
      >
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <SwupProvider />
          <IntroLoader />
          <main className="min-h-screen bg-accent">
            <Header />
            <div id="swup" className="transition-reveal">
              <Container>{children}</Container>
            </div>
            <Footer />
          </main>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
