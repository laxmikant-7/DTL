import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { loginSchema, LoginData, complaintCategories } from "@shared/schema";
import { Loader2, Shield, User, Lock, ArrowLeft, Building2 } from "lucide-react";

const officerRegistrationSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  department: z.enum(complaintCategories, { required_error: "Please select a department" }),
});

type OfficerRegistration = z.infer<typeof officerRegistrationSchema>;

export default function OfficerAuthPage() {
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

  const registerForm = useForm<OfficerRegistration>({
    resolver: zodResolver(officerRegistrationSchema),
    defaultValues: {
      username: "",
      password: "",
      name: "",
      email: "",
      phone: "",
      address: "",
      department: undefined,
    },
  });

  if (user) {
    navigate(user.role === "officer" ? "/officer-dashboard" : "/dashboard");
    return null;
  }

  const onLogin = (data: LoginData) => {
    loginMutation.mutate(data, {
      onSuccess: (user) => {
        if (user.role === "officer") {
          navigate("/officer-dashboard");
        } else {
          navigate("/dashboard");
        }
      },
    });
  };

  const onRegister = (data: OfficerRegistration) => {
    registerMutation.mutate(
      { ...data, role: "officer" },
      {
        onSuccess: () => navigate("/officer-dashboard"),
      }
    );
  };

  const departmentLabels: Record<string, string> = {
    electricity: t("complaint.category.electricity"),
    water: t("complaint.category.water"),
    roads: t("complaint.category.roads"),
    waste: t("complaint.category.waste"),
    other: t("complaint.category.other"),
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600 text-white p-12">
        <div className="max-w-md text-center">
          <div className="h-20 w-20 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-8">
            <Shield className="h-10 w-10" />
          </div>
          <h2 className="text-3xl font-bold mb-4">{t("auth.officer.title")}</h2>
          <p className="text-lg text-white/80 leading-relaxed">
            {t("auth.officer.desc")}
          </p>
          <div className="mt-12 grid grid-cols-2 gap-6">
            {[
              { label: t("officer.total"), value: "100+" },
              { label: t("officer.resolved"), value: "85%" },
            ].map((item, i) => (
              <div key={i} className="text-center p-4 rounded-lg bg-white/10">
                <p className="text-2xl font-bold">{item.value}</p>
                <p className="text-sm text-white/70">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-8 bg-background">
        <div className="absolute top-4 left-4">
          <Link href="/">
            <Button variant="ghost" size="sm" data-testid="button-back-home-officer">
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
            <SelectTrigger className="w-[130px]" data-testid="select-language-officer-auth">
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
              <div className="mx-auto h-12 w-12 rounded-lg bg-slate-800 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-2xl">{t("auth.officer.title")}</CardTitle>
              <CardDescription>{t("auth.officer.desc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "login" | "register")}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login" data-testid="tab-officer-login">
                    {t("auth.login")}
                  </TabsTrigger>
                  <TabsTrigger value="register" data-testid="tab-officer-register">
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
                                  data-testid="input-officer-login-username"
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
                                  data-testid="input-officer-login-password"
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
                        data-testid="button-officer-login-submit"
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
                      data-testid="link-switch-officer-register"
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
                              <Input
                                {...field}
                                placeholder={t("auth.name")}
                                data-testid="input-officer-register-name"
                              />
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
                                  data-testid="input-officer-register-username"
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
                                  data-testid="input-officer-register-password"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={registerForm.control}
                        name="department"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Department</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-officer-department">
                                  <Building2 className="mr-2 h-4 w-4 text-muted-foreground" />
                                  <SelectValue placeholder="Select department" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {complaintCategories.map((cat) => (
                                  <SelectItem key={cat} value={cat} data-testid={`select-dept-${cat}`}>
                                    {departmentLabels[cat]}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("auth.email")}</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="email"
                                placeholder={t("auth.email")}
                                data-testid="input-officer-register-email"
                              />
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
                              <Input
                                {...field}
                                placeholder={t("auth.phone")}
                                data-testid="input-officer-register-phone"
                              />
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
                              <Input
                                {...field}
                                placeholder={t("auth.address")}
                                data-testid="input-officer-register-address"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={registerMutation.isPending}
                        data-testid="button-officer-register-submit"
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
                      data-testid="link-switch-officer-login"
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
    </div>
  );
}
