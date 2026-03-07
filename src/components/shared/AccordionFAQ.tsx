import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export interface FAQItem {
  question: string;
  answer: string;
}

interface AccordionFAQProps {
  items: FAQItem[];
  className?: string;
}

export const AccordionFAQ = ({ items, className = "" }: AccordionFAQProps) => {
  return (
    <div className={`max-w-[720px] mx-auto ${className}`}>
      <Accordion type="single" collapsible className="w-full">
        {items.map((item, i) => (
          <AccordionItem key={i} value={`item-${i}`} className="border-border">
            <AccordionTrigger className="text-left font-serif text-xs md:text-lg font-medium tracking-[0.02em] py-3 md:py-5 hover:no-underline">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-[10px] md:text-[13px] font-sans text-muted-foreground leading-relaxed pb-3 md:pb-5">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
