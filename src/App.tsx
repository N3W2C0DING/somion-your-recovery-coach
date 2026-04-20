import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Auth from "./pages/Auth.tsx";
import Onboarding from "./pages/Onboarding.tsx";
import Today from "./pages/Today.tsx";
import Train from "./pages/Train.tsx";
import Recovery from "./pages/Recovery.tsx";
import History from "./pages/History.tsx";
import Settings from "./pages/Settings.tsx";
import ResetPassword from "./pages/ResetPassword.tsx";
import PrivacyPolicy from "./pages/legal/PrivacyPolicy.tsx";
import TermsOfService from "./pages/legal/TermsOfService.tsx";
import HealthDisclaimer from "./pages/legal/HealthDisclaimer.tsx";
import Support from "./pages/legal/Support.tsx";
import AccountDeletion from "./pages/legal/AccountDeletion.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
          <Route path="/app" element={<ProtectedRoute><Today /></ProtectedRoute>} />
          <Route path="/app/train" element={<ProtectedRoute><Train /></ProtectedRoute>} />
          <Route path="/app/recovery" element={<ProtectedRoute><Recovery /></ProtectedRoute>} />
          <Route path="/app/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
          <Route path="/app/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/health-disclaimer" element={<HealthDisclaimer />} />
          <Route path="/support" element={<Support />} />
          <Route path="/account-deletion" element={<AccountDeletion />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

