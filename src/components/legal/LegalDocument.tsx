import type { ReactNode } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { usePageMetadata } from "@/hooks/usePageMetadata";
import { cn } from "@/lib/utils";

type LegalDocumentProps = {
  title: string;
  seoTitle: string;
  description: string;
  lastUpdated: string;
  intro: ReactNode;
  children: ReactNode;
};

type LegalSectionProps = {
  number: string;
  title: string;
  children: ReactNode;
  className?: string;
};

type LegalTextProps = {
  children: ReactNode;
  className?: string;
};

type LegalListProps = {
  items: ReactNode[];
  className?: string;
};

type LegalCalloutProps = {
  title?: string;
  children: ReactNode;
  className?: string;
};

export const LegalDocument = ({
  title,
  seoTitle,
  description,
  lastUpdated,
  intro,
  children,
}: LegalDocumentProps) => {
  usePageMetadata({ title: seoTitle, description });

  return (
    <PageLayout hideNewsletter>
      <section className="bg-background px-6 py-20 md:py-24">
        <div className="mx-auto max-w-[720px]">
          <h1 className="font-serif text-[34px] leading-tight text-foreground md:text-[40px]">
            {title}
          </h1>
          <p className="mt-4 font-sans text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            Last updated: {lastUpdated}
          </p>
          <div className="mt-8 space-y-4 font-sans text-[15px] leading-relaxed text-foreground">
            {intro}
          </div>
          <div className="mt-12">{children}</div>
        </div>
      </section>
    </PageLayout>
  );
};

export const LegalSection = ({
  number,
  title,
  children,
  className,
}: LegalSectionProps) => (
  <section className={cn("border-t border-border py-12", className)}>
    <h2 className="font-serif text-[24px] leading-tight text-foreground">
      {number}. {title}
    </h2>
    <div className="mt-6 space-y-4 font-sans text-[15px] leading-relaxed text-foreground">
      {children}
    </div>
  </section>
);

export const LegalParagraph = ({ children, className }: LegalTextProps) => (
  <p className={cn("font-sans text-[15px] leading-relaxed text-foreground", className)}>
    {children}
  </p>
);

export const LegalSubheading = ({ children, className }: LegalTextProps) => (
  <h3
    className={cn(
      "font-sans text-[11px] uppercase tracking-[0.2em] text-muted-foreground",
      className,
    )}
  >
    {children}
  </h3>
);

export const LegalList = ({ items, className }: LegalListProps) => (
  <ul
    className={cn(
      "ml-6 list-disc space-y-3 font-sans text-[15px] leading-relaxed text-foreground marker:text-foreground",
      className,
    )}
  >
    {items.map((item, index) => (
      <li key={index}>{item}</li>
    ))}
  </ul>
);

export const LegalCallout = ({ title, children, className }: LegalCalloutProps) => (
  <div className={cn("border border-border bg-card p-6", className)}>
    {title ? (
      <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
        {title}
      </p>
    ) : null}
    <div className={cn("space-y-3", title ? "mt-3" : "")}>{children}</div>
  </div>
);
