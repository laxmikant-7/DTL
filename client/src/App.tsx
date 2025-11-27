import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/language-context";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute, OfficerRoute } from "@/lib/protected-route";
import NotFound from "@/pages/not-found";
import LandingPage from "@/pages/landing";
import AuthPage from "@/pages/auth-page";
import OfficerAuthPage from "@/pages/officer-auth-page";
import CitizenDashboard from "@/pages/citizen-dashboard";
import TrackComplaint from "@/pages/track-complaint";
import OfficerDashboard from "@/pages/officer-dashboard";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/officer-auth" component={OfficerAuthPage} />
      <Route path="/track" component={TrackComplaint} />
      <ProtectedRoute path="/dashboard" component={CitizenDashboard} />
      <OfficerRoute path="/officer-dashboard" component={OfficerDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <AuthProvider>
            <Toaster />
            <Router />
          </AuthProvider>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
