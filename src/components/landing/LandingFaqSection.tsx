import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";

type LandingFaqSectionProps = {
  faqs: string[];
  answer: string;
};

export function LandingFaqSection({ faqs, answer }: LandingFaqSectionProps) {
  return (
    <section className="border-t border-border/40 bg-muted/5 py-24" aria-labelledby="faq-heading">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <h2 id="faq-heading" className="text-center text-balance text-3xl font-semibold md:text-5xl">
          Questions, answered
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-muted-foreground">
          Security, assets, fees, and platform coverage—straight to the point.
        </p>

        <Card className="glass-panel mt-12">
          <CardContent className="p-4 sm:p-6">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((item, index) => (
                <AccordionItem key={item} value={`faq-${index}`}>
                  <AccordionTrigger className="text-left text-base">{item}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
