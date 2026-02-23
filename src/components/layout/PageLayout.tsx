import { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { SiteFooter } from "./SiteFooter";

interface PageLayoutProps {
  children: ReactNode;
}

export const PageLayout = ({ children }: PageLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
};
