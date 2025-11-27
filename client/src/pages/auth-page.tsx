import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage, languageOptions, Language } from "@/contexts/language-context";
import { useAuth } from "@/hooks/use-auth";
import { citizenRegistrationSchema, loginSchema, CitizenRegistration, LoginData } from "@shared/schema";
import { Loader2, FileText, User, Mail, Phone, MapPin, Lock, ArrowLeft } from "lucide-react";

export default function AuthPage() {
  const { t, language, setLanguage } = useLanguage();
  const { user, loginMutation, registerMutation } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  const loginForm = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm<CitizenRegistration>({
    resolver: zodResolver(citizenRegistrationSchema),
    defaultValues: {
      username: "",
      password: "",
      name: "",
      email: "",
      phone: "",
      address: "",
    },
  });

  if (user) {
    navigate(user.role === "officer" ? "/officer-dashboard" : "/dashboard");
    return null;
  }

  const onLogin = (data: LoginData) => {
    loginMutation.mutate(data, {
      onSuccess: () => navigate("/dashboard"),
    });
  };

  const onRegister = (data: CitizenRegistration) => {
    registerMutation.mutate(
      { ...data, role: "citizen", department: null },
      {
        onSuccess: () => navigate("/dashboard"),
      }
    );
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-8 bg-background">
        <div className="absolute top-4 left-4">
          <Link href="/">
            <Button variant="ghost" size="sm" data-testid="button-back-home">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("nav.home")}
            </Button>
          </Link>
        </div>
        <div className="absolute top-4 right-4">
          <Select
            value={language}
            onValueChange={(value) => setLanguage(value as Language)}
          >
            <SelectTrigger className="w-[130px]" data-testid="select-language-auth">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languageOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mx-auto w-full max-w-md">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto h-12 w-12 rounded-lg bg-primary flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl">{t("auth.citizen.title")}</CardTitle>
              <CardDescription>{t("auth.citizen.desc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "login" | "register")}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login" data-testid="tab-login">
                    {t("auth.login")}
                  </TabsTrigger>
                  <TabsTrigger value="register" data-testid="tab-register">
                    {t("auth.register")}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("auth.username")}</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                  {...field}
                                  className="pl-10"
                                  placeholder={t("auth.username")}
                                  data-testid="input-login-username"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("auth.password")}</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                  {...field}
                                  type="password"
                                  className="pl-10"
                                  placeholder={t("auth.password")}
                                  data-testid="input-login-password"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={loginMutation.isPending}
                        data-testid="button-login-submit"
                      >
                        {loginMutation.isPending ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : null}
                        {t("auth.login")}
                      </Button>
                    </form>
                  </Form>
                  <p className="text-center text-sm text-muted-foreground mt-4">
                    {t("auth.newUser")}{" "}
                    <button
                      type="button"
                      onClick={() => setActiveTab("register")}
                      className="text-primary hover:underline font-medium"
                      data-testid="link-switch-register"
                    >
                      {t("auth.register")}
                    </button>
                  </p>
                </TabsContent>

                <TabsContent value="register">
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                      <FormField
                        control={registerForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("auth.name")}</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                  {...field}
                                  className="pl-10"
                                  placeholder={t("auth.name")}
                                  data-testid="input-register-name"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={registerForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("auth.username")}</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder={t("auth.username")}
                                  data-testid="input-register-username"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("auth.password")}</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="password"
                                  placeholder={t("auth.password")}
                                  data-testid="input-register-password"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={registerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("auth.email")}</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                  {...field}
                                  type="email"
                                  className="pl-10"
                                  placeholder={t("auth.email")}
                                  data-testid="input-register-email"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("auth.phone")}</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                  {...field}
                                  className="pl-10"
                                  placeholder={t("auth.phone")}
                                  data-testid="input-register-phone"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("auth.address")}</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                  {...field}
                                  className="pl-10"
                                  placeholder={t("auth.address")}
                                  data-testid="input-register-address"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={registerMutation.isPending}
                        data-testid="button-register-submit"
                      >
                        {registerMutation.isPending ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : null}
                        {t("auth.register")}
                      </Button>
                    </form>
                  </Form>
                  <p className="text-center text-sm text-muted-foreground mt-4">
                    {t("auth.existingUser")}{" "}
                    <button
                      type="button"
                      onClick={() => setActiveTab("login")}
                      className="text-primary hover:underline font-medium"
                      data-testid="link-switch-login"
                    >
                      {t("auth.login")}
                    </button>
                  </p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground p-12">
        <div className="max-w-md text-center">
          <div className="h-20 w-20 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-8">
            <FileText className="h-10 w-10" />
          </div>
          <h2 className="text-3xl font-bold mb-4">{t("app.title")}</h2>
          <p className="text-lg text-primary-foreground/80 leading-relaxed">
            {t("app.tagline")}
          </p>
          <div className="mt-12 grid grid-cols-3 gap-6">
            {[
              { label: t("landing.feature.submit"), icon: FileText },
              { label: t("landing.feature.track"), icon: "Search" },
              { label: t("landing.feature.resolve"), icon: "CheckCircle" },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="h-12 w-12 rounded-lg bg-white/10 flex items-center justify-center mx-auto mb-2">
                  <item.icon className="h-6 w-6" />
                </div>
                <p className="text-sm text-primary-foreground/70">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
