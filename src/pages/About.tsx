import { useLayoutEffect } from "react";
import { Link } from "react-router-dom";

import { MainHeader } from "@/components/layout/MainHeader";
import { LandingFooter } from "@/components/layout/LandingFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  aboutCta,
  aboutHero,
  aboutMission,
  aboutValues,
  teamMembers,
} from "@/data/aboutContent";

import teamCardWaveBg from "@/assets/about-team-wave-bg.png";

export default function AboutPage() {
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="marketplace-root min-h-screen bg-background text-foreground">
      <MainHeader />

      <main>
        <section
          className="relative overflow-hidden border-b border-border/50 px-5 py-16 sm:px-8 md:py-24"
          aria-labelledby="about-hero-title"
        >
          <div className="hero-glow pointer-events-none absolute inset-0" aria-hidden />
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-[min(90vw,28rem)] w-[min(90vw,28rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute left-1/2 top-1/3 h-40 w-40 -translate-x-1/2 rounded-full border border-primary/35 shadow-[0_0_80px_-20px_hsl(var(--primary)/0.5)] md:h-52 md:w-52"
            aria-hidden
          />

          <div className="relative mx-auto max-w-6xl text-center">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">{aboutHero.eyebrow}</p>
            <h1 id="about-hero-title" className="mx-auto mt-4 max-w-3xl text-balance text-3xl font-semibold tracking-tight md:text-5xl">
              {aboutHero.title}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-sm text-muted-foreground md:text-base">{aboutHero.subtitle}</p>
          </div>
        </section>

        <section className="border-t border-border/50 bg-muted/15 px-5 py-16 sm:px-8 lg:px-10" aria-labelledby="meet-team-heading">
          <div className="mx-auto max-w-6xl">
            <p className="text-xs font-medium uppercase tracking-wider text-primary">Chúng ta là ai</p>
            <h2 id="meet-team-heading" className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
              Gặp đội ngũ đứng sau FinMom
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Hai nhà đồng sáng lập và nhóm nhỏ làm việc cùng cộng đồ traders & creators.
            </p>

            <div className="mt-12 grid gap-8 md:grid-cols-2 md:gap-10">
              {teamMembers.map((member) => (
                <Card
                  key={member.name}
                  className="glass-panel relative isolate flex flex-col overflow-hidden rounded-3xl border-border/70 shadow-sm"
                >
                  <div
                    className="relative aspect-[4/5] overflow-hidden rounded-t-[inherit] bg-muted/25 bg-cover bg-center"
                    style={{ backgroundImage: `url(${teamCardWaveBg})` }}
                  >
                    <img
                      src={member.portraitSrc}
                      alt={`Chân dung ${member.name}`}
                      className="absolute inset-2.5 h-[calc(100%-1.25rem)] w-[calc(100%-1.25rem)] rounded-2xl object-cover object-top shadow-lg ring-1 ring-black/20 sm:inset-3 sm:h-[calc(100%-1.5rem)] sm:w-[calc(100%-1.5rem)]"
                      loading="lazy"
                    />
                  </div>
                  <CardContent className="relative z-[1] flex flex-1 flex-col gap-3 bg-background/80 p-5 backdrop-blur-sm sm:p-6">
                    <div>
                      <h3 className="text-lg font-semibold">{member.name}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{member.role}</p>
                    </div>
                    <div className="mt-auto rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/30 via-primary/15 to-muted/50 p-4 text-sm leading-relaxed text-white shadow-inner">
                      {member.bio}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:px-10" aria-labelledby="mission-heading">
          <h2 id="mission-heading" className="text-2xl font-semibold tracking-tight md:text-3xl">
            {aboutMission.headline}
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">{aboutMission.body}</p>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {aboutValues.map((item) => (
              <Card key={item.title} className="glass-panel border-border/70">
                <CardContent className="p-5 sm:p-6">
                  <h3 className="text-base font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="border-t border-border/50 px-5 py-16 sm:px-8 lg:px-10">
          <Card className="glass-panel mx-auto max-w-6xl overflow-hidden border-primary/25">
            <CardContent className="flex flex-col items-center gap-4 px-6 py-12 text-center sm:px-10">
              <h2 className="max-w-2xl text-balance text-xl font-semibold md:text-2xl">{aboutCta.title}</h2>
              <p className="max-w-xl text-sm text-muted-foreground">{aboutCta.subtitle}</p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button asChild className="rounded-full px-8">
                  <Link to="/register">Đăng ký miễn phí</Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full border-border/60">
                  <Link to="/marketplace">Marketplace</Link>
                </Button>
                <Button asChild variant="ghost" className="rounded-full text-muted-foreground">
                  <Link to="/pricing">Pricing</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
