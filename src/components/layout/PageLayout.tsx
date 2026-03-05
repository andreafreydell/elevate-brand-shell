import { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { PromoBar } from "@/components/PromoBar";
import { SiteFooter } from "./SiteFooter";

interface PageLayoutProps {
  children: ReactNode;
  hideNewsletter?: boolean;
}

export const PageLayout = ({ children, hideNewsletter }: PageLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <PromoBar />
      <Navbar />
      <main>{children}</main>
      <SiteFooter hideNewsletter={hideNewsletter} />
    </div>
  );
};
