import { Card, CardContent } from "@/components/ui/card";

type LandingTestimonialProps = {
  avatarSrc: string;
  name: string;
  role: string;
  quote: string;
};

export function LandingTestimonial({ avatarSrc, name, role, quote }: LandingTestimonialProps) {
  return (
    <section className="border-t border-border/40 bg-muted/10 py-24" aria-labelledby="testimonial-heading">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <h2 id="testimonial-heading" className="max-w-2xl text-balance text-3xl font-semibold md:text-5xl">
          Trusted by traders who live in the terminal
        </h2>
        <p className="mt-4 max-w-2xl text-muted-foreground md:text-lg">
          Opinionated product surfaces, fast iteration, and a marketplace that keeps strategies moving.
        </p>

        <div className="mt-12 grid gap-10 lg:grid-cols-[280px_1fr] lg:items-stretch">
          <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/50">
            <img src={avatarSrc} alt={name} className="h-full min-h-[280px] w-full object-cover lg:min-h-0" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" aria-hidden />
          </div>
          <Card className="glass-panel flex">
            <CardContent className="flex flex-col justify-center gap-6 p-8 md:p-10">
              <div>
                <p className="text-lg font-semibold md:text-xl">{name}</p>
                <p className="text-sm text-muted-foreground">{role}</p>
              </div>
              <blockquote className="border-l-2 border-primary/50 pl-6 text-pretty text-lg leading-relaxed text-foreground/95 md:text-xl">
                {quote}
              </blockquote>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
