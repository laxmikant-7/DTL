import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/language-context";
import { useAuth } from "@/hooks/use-auth";
import { Header } from "@/components/layout/header";
import { FileText, Search, CheckCircle, Zap, Droplets, Route, Trash2, HelpCircle, ArrowRight } from "lucide-react";

export default function LandingPage() {
  const { t } = useLanguage();
  const { user } = useAuth();

  const features = [
    {
      icon: FileText,
      title: t("landing.feature.submit"),
      description: t("landing.feature.submit.desc"),
    },
    {
      icon: Search,
      title: t("landing.feature.track"),
      description: t("landing.feature.track.desc"),
    },
    {
      icon: CheckCircle,
      title: t("landing.feature.resolve"),
      description: t("landing.feature.resolve.desc"),
    },
  ];

  const categories = [
    { icon: Zap, label: t("complaint.category.electricity"), color: "text-yellow-500" },
    { icon: Droplets, label: t("complaint.category.water"), color: "text-blue-500" },
    { icon: Route, label: t("complaint.category.roads"), color: "text-gray-500" },
    { icon: Trash2, label: t("complaint.category.waste"), color: "text-green-500" },
    { icon: HelpCircle, label: t("complaint.category.other"), color: "text-purple-500" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/10" />
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
          
          <div className="container relative mx-auto px-4 md:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6" data-testid="text-hero-title">
                {t("landing.hero.title")}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed" data-testid="text-hero-subtitle">
                {t("landing.hero.subtitle")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {user ? (
                  <Link href={user.role === "officer" ? "/officer-dashboard" : "/dashboard"}>
                    <Button size="lg" className="w-full sm:w-auto" data-testid="button-go-dashboard">
                      {t("nav.dashboard")}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/auth">
                      <Button size="lg" className="w-full sm:w-auto" data-testid="button-citizen-login">
                        {t("landing.citizen.login")}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href="/officer-auth">
                      <Button size="lg" variant="outline" className="w-full sm:w-auto" data-testid="button-officer-login">
                        {t("landing.officer.login")}
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="hover-elevate transition-shadow duration-200" data-testid={`card-feature-${index}`}>
                  <CardHeader>
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                {t("complaint.category")}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {t("landing.feature.submit.desc")}
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
              {categories.map((category, index) => (
                <Card
                  key={index}
                  className="text-center p-6 hover-elevate transition-shadow duration-200"
                  data-testid={`card-category-${index}`}
                >
                  <category.icon className={`h-10 w-10 mx-auto mb-3 ${category.color}`} />
                  <p className="font-medium text-sm">{category.label}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 md:px-6 lg:px-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              {t("track.title")}
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              {t("landing.feature.track.desc")}
            </p>
            <Link href="/track">
              <Button
                size="lg"
                variant="secondary"
                className="bg-background text-foreground hover:bg-background/90"
                data-testid="button-track-cta"
              >
                <Search className="mr-2 h-4 w-4" />
                {t("nav.track")}
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t py-8 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
                <FileText className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-sm font-medium">{t("app.title")}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Citizen Grievance Portal. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
