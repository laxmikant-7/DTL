import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage, languageOptions, Language } from "@/contexts/language-context";
import { useAuth } from "@/hooks/use-auth";
import { Menu, User, LogOut, FileText, Search, Home } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Header() {
  const { language, setLanguage, t } = useLanguage();
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logoutMutation.mutate();
    setMobileMenuOpen(false);
  };

  const isOfficer = user?.role === "officer";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/">
            <span
              className="flex items-center gap-2 font-medium text-lg cursor-pointer"
              data-testid="link-home-logo"
            >
              <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="hidden sm:inline-block">{t("app.title")}</span>
            </span>
          </Link>

          <div className="flex items-center gap-2 md:gap-4">
            <Select
              value={language}
              onValueChange={(value) => setLanguage(value as Language)}
            >
              <SelectTrigger
                className="w-[100px] md:w-[130px]"
                data-testid="select-language"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languageOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    data-testid={`select-language-${option.value}`}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <nav className="hidden md:flex items-center gap-2">
              {user ? (
                <>
                  {isOfficer ? (
                    <Link href="/officer-dashboard">
                      <Button
                        variant={location === "/officer-dashboard" ? "default" : "ghost"}
                        data-testid="link-officer-dashboard"
                      >
                        {t("nav.dashboard")}
                      </Button>
                    </Link>
                  ) : (
                    <>
                      <Link href="/dashboard">
                        <Button
                          variant={location === "/dashboard" ? "default" : "ghost"}
                          data-testid="link-dashboard"
                        >
                          {t("nav.dashboard")}
                        </Button>
                      </Link>
                      <Link href="/track">
                        <Button
                          variant={location === "/track" ? "default" : "ghost"}
                          data-testid="link-track"
                        >
                          {t("nav.track")}
                        </Button>
                      </Link>
                    </>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" data-testid="button-user-menu">
                        <User className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem disabled className="font-medium">
                        {user.name}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={handleLogout}
                        data-testid="button-logout"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        {t("nav.logout")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Link href="/auth">
                    <Button variant="ghost" data-testid="link-citizen-login">
                      {t("landing.citizen.login")}
                    </Button>
                  </Link>
                  <Link href="/officer-auth">
                    <Button variant="outline" data-testid="link-officer-login">
                      {t("landing.officer.login")}
                    </Button>
                  </Link>
                </>
              )}
            </nav>

            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" data-testid="button-mobile-menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px]">
                <nav className="flex flex-col gap-4 mt-8">
                  {user ? (
                    <>
                      <div className="px-2 py-3 border-b mb-2">
                        <p className="text-sm text-muted-foreground">Signed in as</p>
                        <p className="font-medium">{user.name}</p>
                      </div>
                      {isOfficer ? (
                        <Link href="/officer-dashboard" onClick={() => setMobileMenuOpen(false)}>
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                            data-testid="mobile-link-officer-dashboard"
                          >
                            <Home className="mr-2 h-4 w-4" />
                            {t("nav.dashboard")}
                          </Button>
                        </Link>
                      ) : (
                        <>
                          <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                            <Button
                              variant="ghost"
                              className="w-full justify-start"
                              data-testid="mobile-link-dashboard"
                            >
                              <Home className="mr-2 h-4 w-4" />
                              {t("nav.dashboard")}
                            </Button>
                          </Link>
                          <Link href="/track" onClick={() => setMobileMenuOpen(false)}>
                            <Button
                              variant="ghost"
                              className="w-full justify-start"
                              data-testid="mobile-link-track"
                            >
                              <Search className="mr-2 h-4 w-4" />
                              {t("nav.track")}
                            </Button>
                          </Link>
                        </>
                      )}
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-destructive"
                        onClick={handleLogout}
                        data-testid="mobile-button-logout"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        {t("nav.logout")}
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          data-testid="mobile-link-home"
                        >
                          <Home className="mr-2 h-4 w-4" />
                          {t("nav.home")}
                        </Button>
                      </Link>
                      <Link href="/auth" onClick={() => setMobileMenuOpen(false)}>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          data-testid="mobile-link-citizen-auth"
                        >
                          <User className="mr-2 h-4 w-4" />
                          {t("landing.citizen.login")}
                        </Button>
                      </Link>
                      <Link href="/officer-auth" onClick={() => setMobileMenuOpen(false)}>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          data-testid="mobile-link-officer-auth"
                        >
                          <User className="mr-2 h-4 w-4" />
                          {t("landing.officer.login")}
                        </Button>
                      </Link>
                      <Link href="/track" onClick={() => setMobileMenuOpen(false)}>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          data-testid="mobile-link-track-public"
                        >
                          <Search className="mr-2 h-4 w-4" />
                          {t("nav.track")}
                        </Button>
                      </Link>
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
