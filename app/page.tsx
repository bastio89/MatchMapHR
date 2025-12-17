import Link from 'next/link'
import {
  Upload,
  Sparkles,
  ListChecks,
  Shield,
  Clock,
  Target,
  TrendingDown,
  FileSearch,
  Check,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Lock,
  FileCheck,
  Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import t from '@/lib/i18n'

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold">{t.common.appName}</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="#pricing"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Pricing
            </Link>
            <Link
              href="#faq"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              FAQ
            </Link>
            <Button variant="ghost" asChild>
              <Link href="/auth/signin">{t.auth.signin}</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/signup">{t.auth.signup}</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b bg-gradient-to-b from-muted/50 to-background py-20 md:py-32">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              {/* KPI Badges */}
              <div className="mb-6 flex flex-wrap justify-center gap-3">
                {t.landing.hero.badges.map((badge: string, idx: number) => (
                  <Badge key={idx} variant="secondary" className="bg-purple-100 text-purple-900 border-purple-200">
                    <Check className="mr-1.5 h-3.5 w-3.5" />
                    {badge}
                  </Badge>
                ))}
              </div>

              <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                {t.landing.hero.title}
                <br />
                <span className="text-primary">{t.landing.hero.titleHighlight}</span>
              </h1>
              <p className="mb-8 text-lg text-muted-foreground md:text-xl">
                {t.landing.hero.subtitle}
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Button size="lg" asChild>
                  <Link href="/auth/signup">
                    {t.landing.hero.cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="#steps">{t.landing.hero.ctaSecondary}</Link>
                </Button>
              </div>
            </div>
          </div>
          {/* Decorative gradient */}
          <div className="absolute -top-24 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        </section>

        {/* Problem/Solution Section */}
        <section className="py-20 bg-gradient-to-br from-red-50 to-orange-50">
          <div className="container max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">{t.landing.problem.title}</h2>
              <p className="text-lg text-muted-foreground">{t.landing.problem.subtitle}</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3 mb-12">
              {t.landing.problem.points.map((point: { title: string; description: string }, idx: number) => (
                <Card key={idx} className="border-2 border-red-200 bg-white">
                  <CardHeader>
                    <CardTitle className="text-lg text-red-700 flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      {point.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{point.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-8 border-2 border-purple-300">
              <h3 className="text-2xl font-bold mb-3 text-purple-900">{t.landing.problem.solution.title}</h3>
              <p className="text-lg text-purple-800 max-w-3xl mx-auto">{t.landing.problem.solution.description}</p>
            </div>
          </div>
        </section>

        {/* Steps Section */}
        <section id="steps" className="py-20">
          <div className="container">
            <h2 className="mb-12 text-center text-3xl font-bold">
              {t.landing.steps.title}
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              {/* Step 1 */}
              <div className="relative flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <div className="absolute left-[calc(50%+40px)] top-8 hidden h-0.5 w-[calc(100%-80px)] bg-primary/20 md:block" />
                <span className="mb-2 text-sm font-medium text-primary">Schritt 1</span>
                <h3 className="mb-2 text-xl font-semibold">
                  {t.landing.steps.step1.title}
                </h3>
                <p className="text-muted-foreground">
                  {t.landing.steps.step1.description}
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <div className="absolute left-[calc(50%+40px)] top-8 hidden h-0.5 w-[calc(100%-80px)] bg-primary/20 md:block" />
                <span className="mb-2 text-sm font-medium text-primary">Schritt 2</span>
                <h3 className="mb-2 text-xl font-semibold">
                  {t.landing.steps.step2.title}
                </h3>
                <p className="text-muted-foreground">
                  {t.landing.steps.step2.description}
                </p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <ListChecks className="h-8 w-8 text-primary" />
                </div>
                <span className="mb-2 text-sm font-medium text-primary">Schritt 3</span>
                <h3 className="mb-2 text-xl font-semibold">
                  {t.landing.steps.step3.title}
                </h3>
                <p className="text-muted-foreground">
                  {t.landing.steps.step3.description}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* KPI Benefits Section */}
        <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-50">
          <div className="container max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">{t.landing.kpiBenefits.title}</h2>
              <p className="text-lg text-muted-foreground">{t.landing.kpiBenefits.subtitle}</p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {t.landing.kpiBenefits.metrics.map((metric: any, idx: number) => (
                <Card key={idx} className="border-2 border-green-300 bg-white">
                  <CardHeader>
                    <CardTitle className="text-xl text-green-900">{metric.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Vorher</p>
                        <p className="text-2xl font-bold text-red-600">{metric.before}</p>
                      </div>
                      <ArrowRight className="h-6 w-6 text-green-600" />
                      <div>
                        <p className="text-sm text-muted-foreground">Nachher</p>
                        <p className="text-2xl font-bold text-green-600">{metric.after}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{metric.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/auth/signup">
                <Button size="lg" className="text-lg px-8 py-6">
                  {t.landing.hero.cta}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="border-y bg-muted/30 py-20">
          <div className="container">
            <h2 className="mb-12 text-center text-3xl font-bold">
              {t.landing.features.title}
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <Lock className="mb-2 h-8 w-8 text-primary" />
                  <CardTitle className="text-lg">
                    {t.landing.features.gdpr.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {t.landing.features.gdpr.description}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <FileCheck className="mb-2 h-8 w-8 text-primary" />
                  <CardTitle className="text-lg">
                    {t.landing.features.audit.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {t.landing.features.audit.description}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Users className="mb-2 h-8 w-8 text-primary" />
                  <CardTitle className="text-lg">
                    {t.landing.features.fairness.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {t.landing.features.fairness.description}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20">
          <div className="container">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold">
                {t.landing.pricing.title}
              </h2>
              <p className="text-muted-foreground">
                {t.landing.pricing.subtitle}
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {/* Starter */}
              <Card>
                <CardHeader>
                  <CardTitle>{t.landing.pricing.starter.name}</CardTitle>
                  <CardDescription>
                    {t.landing.pricing.starter.description}
                  </CardDescription>
                  <div className="pt-4">
                    <span className="text-4xl font-bold">
                      {t.landing.pricing.starter.price}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 rounded-lg bg-green-50 p-3 border border-green-200">
                    <p className="text-sm font-medium text-green-900">
                      <Target className="inline h-4 w-4 mr-1" />
                      {t.landing.pricing.starter.impact}
                    </p>
                  </div>
                  <ul className="space-y-2">
                    {t.landing.pricing.starter.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant="outline" asChild>
                    <Link href="/auth/signup">Kostenlos testen</Link>
                  </Button>
                </CardFooter>
              </Card>

              {/* Pro */}
              <Card className="border-primary shadow-lg">
                <CardHeader>
                  <div className="mb-2 w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    Beliebt
                  </div>
                  <CardTitle>{t.landing.pricing.pro.name}</CardTitle>
                  <CardDescription>
                    {t.landing.pricing.pro.description}
                  </CardDescription>
                  <div className="pt-4">
                    <span className="text-4xl font-bold">
                      {t.landing.pricing.pro.price}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 rounded-lg bg-green-50 p-3 border border-green-200">
                    <p className="text-sm font-medium text-green-900">
                      <Target className="inline h-4 w-4 mr-1" />
                      {t.landing.pricing.pro.impact}
                    </p>
                  </div>
                  <ul className="space-y-2">
                    {t.landing.pricing.pro.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" asChild>
                    <Link href="/auth/signup">Kostenlos testen</Link>
                  </Button>
                </CardFooter>
              </Card>

              {/* Enterprise */}
              <Card>
                <CardHeader>
                  <CardTitle>{t.landing.pricing.enterprise.name}</CardTitle>
                  <CardDescription>
                    {t.landing.pricing.enterprise.description}
                  </CardDescription>
                  <div className="pt-4">
                    <span className="text-4xl font-bold">
                      {t.landing.pricing.enterprise.price}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 rounded-lg bg-green-50 p-3 border border-green-200">
                    <p className="text-sm font-medium text-green-900">
                      <Target className="inline h-4 w-4 mr-1" />
                      {t.landing.pricing.enterprise.impact}
                    </p>
                  </div>
                  <ul className="space-y-2">
                    {t.landing.pricing.enterprise.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant="outline">
                    Kontakt aufnehmen
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="border-t bg-muted/30 py-20">
          <div className="container">
            <h2 className="mb-12 text-center text-3xl font-bold">
              {t.landing.faq.title}
            </h2>
            <div className="mx-auto max-w-2xl">
              <Accordion type="single" collapsible className="w-full">
                {t.landing.faq.items.map((item, i) => (
                  <AccordionItem key={i} value={`item-${i}`}>
                    <AccordionTrigger className="text-left">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <div className="container max-w-4xl text-center">
            <h2 className="text-4xl font-bold mb-4">
              Starten Sie jetzt – in unter 2 Minuten
            </h2>
            <p className="text-xl mb-8 text-purple-100">
              Keine Kreditkarte erforderlich. Keine versteckten Kosten. DSGVO-konform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6" asChild>
                <Link href="/auth/signup">
                  Kostenlos testen
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="font-semibold">{t.common.appName}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {t.landing.footer.copyright}
            </p>
            <nav className="flex gap-4 text-sm text-muted-foreground">
              <Link href="/impressum" className="hover:text-foreground">
                {t.landing.footer.imprint}
              </Link>
              <Link href="/datenschutz" className="hover:text-foreground">
                {t.landing.footer.privacy}
              </Link>
              <Link href="/agb" className="hover:text-foreground">
                {t.landing.footer.terms}
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}
